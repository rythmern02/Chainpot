use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("A1A2JLvFmJJZ4C2BUUTvhtrWt4VwqYkdD77ZRyvsh5K8");

#[program]
pub mod chain_pot {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        pool_id: u64,
        member_count: u8,
        monthly_contribution: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.pool_id = pool_id;
        pool.admin = ctx.accounts.admin.key();
        pool.member_count = member_count;
        pool.monthly_contribution = monthly_contribution;
        pool.current_cycle = 0;
        pool.total_amount = 0;
        Ok(())
    }

    pub fn join_pool(ctx: Context<JoinPool>, pool_id: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let user = &mut ctx.accounts.user;

        require!(
            pool.members.len() < pool.member_count as usize,
            ErrorCode::PoolFull
        );
        require!(
            !pool.members.contains(&user.key()),
            ErrorCode::AlreadyJoined
        );

        // Mint NFT using Metaplex (simplified for brevity)
        // In a real implementation, you'd interact with Metaplex APIs here
        let nft_mint = &ctx.accounts.nft_mint;

        // Lock NFT in the pool
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.nft_token.to_account_info(),
                    to: pool.to_account_info(),
                    authority: user.to_account_info(),
                },
            ),
            1,
        )?;

        pool.members.push(user.key());
        pool.nfts.push(nft_mint.key());

        Ok(())
    }

    pub fn contribute(ctx: Context<Contribute>, pool_id: u64, amount: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let user = &ctx.accounts.user;

        require!(pool.members.contains(&user.key()), ErrorCode::NotAMember);
        require!(
            amount == pool.monthly_contribution,
            ErrorCode::InvalidContribution
        );

        // Transfer contribution to pool
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.user_token.to_account_info(),
                    to: ctx.accounts.pool_token.to_account_info(),
                    authority: user.to_account_info(),
                },
            ),
            amount,
        )?;

        pool.total_amount += amount;
        Ok(())
    }

    pub fn place_bid(ctx: Context<PlaceBid>, pool_id: u64, bid_amount: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let user = &ctx.accounts.user;

        require!(pool.members.contains(&user.key()), ErrorCode::NotAMember);
        require!(pool.current_cycle < pool.member_count, ErrorCode::PoolEnded);

        if let Some(current_bid) = pool.current_bid {
            require!(bid_amount < current_bid, ErrorCode::BidTooHigh);
        }

        pool.current_bid = Some(bid_amount);
        pool.current_winner = Some(user.key());

        Ok(())
    }

    pub fn end_cycle(ctx: Context<EndCycle>, pool_id: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        let winner = &ctx.accounts.winner;

        require!(pool.current_cycle < pool.member_count, ErrorCode::PoolEnded);
        require!(
            pool.current_winner == Some(winner.key()),
            ErrorCode::NotTheWinner
        );

        let bid_amount = pool.current_bid.unwrap();
        let payout_amount = pool.total_amount - bid_amount;

        // Transfer payout to winner
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.pool_token.to_account_info(),
                    to: ctx.accounts.winner_token.to_account_info(),
                    authority: pool.to_account_info(),
                },
            ),
            payout_amount,
        )?;

        pool.total_amount = bid_amount;
        pool.current_cycle += 1;
        pool.current_bid = None;
        pool.current_winner = None;

        Ok(())
    }

    pub fn close_pool(ctx: Context<ClosePool>, pool_id: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;

        require!(
            pool.current_cycle == pool.member_count,
            ErrorCode::PoolNotEnded
        );

        // Return NFTs to respective owners
        for (member, nft) in pool.members.iter().zip(pool.nfts.iter()) {
            // Transfer NFT back to member (simplified, you'd need to implement this)
        }

        // Distribute any remaining funds equally among members
        let remaining_amount = pool.total_amount / pool.member_count as u64;
        for member in pool.members.iter() {
            // Transfer remaining amount to each member (simplified)
        }

        Ok(())
    }
}
#[derive(Accounts)]
#[instruction(pool_id: u64)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 8 + 32 + 1 + 8 + 4 + 8 + 32 * 50 + 32 * 50,
        seeds = [b"Pool", admin.key().as_ref(), &pool_id.to_le_bytes()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(pool_id: u64)]
pub struct JoinPool<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub nft_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(pool_id: u64)]
pub struct Contribute<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(pool_id: u64)]
pub struct PlaceBid<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(pool_id: u64)]
pub struct EndCycle<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub winner: Signer<'info>,
    #[account(mut)]
    pub pool_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub winner_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(pool_id: u64)]
pub struct ClosePool<'info> {
    #[account(mut, close = admin)]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub admin: Signer<'info>,
}

#[account]
pub struct Pool {
    pub pool_id: u64,
    pub admin: Pubkey,
    pub member_count: u8,
    pub monthly_contribution: u64,
    pub current_cycle: u8,
    pub total_amount: u64,
    pub members: Vec<Pubkey>,
    pub nfts: Vec<Pubkey>,
    pub current_bid: Option<u64>,
    pub current_winner: Option<Pubkey>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Pool is already full")]
    PoolFull,
    #[msg("User has already joined the pool")]
    AlreadyJoined,
    #[msg("User is not a member of this pool")]
    NotAMember,
    #[msg("Invalid contribution amount")]
    InvalidContribution,
    #[msg("Pool has ended")]
    PoolEnded,
    #[msg("Bid is not lower than the current bid")]
    BidTooHigh,
    #[msg("Not the winner of the current cycle")]
    NotTheWinner,
    #[msg("Pool has not ended yet")]
    PoolNotEnded,
}

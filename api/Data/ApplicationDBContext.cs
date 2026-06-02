using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace api.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {
            
        }

        public DbSet<Stock> Stocks { get; set; }
        public DbSet<Comment> Comments { get; set; }

        public DbSet<Portfolio> Portfolios { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Stock decimal properties
            builder.Entity<Stock>()
                .Property(s => s.Purchase)
                .HasPrecision(18, 2);
            
            builder.Entity<Stock>()
                .Property(s => s.LastDiv)
                .HasPrecision(18, 2);

            // Composite primary key cho join table
            builder.Entity<Portfolio>(x => x.HasKey(p => new { p.AppUserId, p.StockId }));

            builder.Entity<Portfolio>()
                .HasOne(u => u.AppUser)
                .WithMany(u => u.Portfolios)
                .HasForeignKey(p => p.AppUserId);

            builder.Entity<Portfolio>()
                .HasOne(u => u.Stock)
                .WithMany(u => u.Portfolios)
                .HasForeignKey(p => p.StockId);

            // Seed Roles with static values to avoid non-deterministic model warning
            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole { Id = "a0aefc06-8d88-49c3-a57c-e79349567662", Name = "Admin", NormalizedName = "ADMIN", ConcurrencyStamp = "e6f6cd6c-1477-4411-aec2-d714b7c7d538" },
                new IdentityRole { Id = "c68465fe-a295-4b6d-b8e5-54d155a2c664", Name = "User", NormalizedName = "USER", ConcurrencyStamp = "f1867c30-593c-4b6b-90b6-66ed863fac03" }
            };
            builder.Entity<IdentityRole>().HasData(roles);

            //user detail
            builder.Entity<AppUser>()
            .HasOne(u => u.UserDetail)
            .WithOne(d => d.AppUser)
            .HasForeignKey<UserDetail>(d => d.AppUserId);
        }

        public DbSet<UserDetail> UserDetails { get; set; }
    }
}
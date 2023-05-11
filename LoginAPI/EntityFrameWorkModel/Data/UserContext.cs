/*==============================================================================
 *
 * User Context to connect entity framework to database
 *
 * Copyright © Dorset Software Training, 2023
 *
 * TSD Section: Noughts and Crosses
 *
 *============================================================================*/
using Microsoft.EntityFrameworkCore;
using Models.EntityFrameWork;

namespace EntityFrameWorkModel.Data
{
    /// <summary>
    /// User Context for entity framework use
    /// </summary>
    public class UserContext : DbContext
    {
        /// <summary>
        /// constructor of user context with base options set up
        /// </summary>
        /// <param name="options"> base options to set up</param>
        public UserContext(DbContextOptions<UserContext> options): base(options)
        {
        }

        /// <summary>
        /// Database User Login Table
        /// </summary>
        public DbSet<UserLogin> UserLogins { get; set; }

        /// <summary>
        /// override function to ensure the database is built correctly 
        /// </summary>
        /// <param name="modelBuilder"> the model builder </param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserLogin>().ToTable("UserLogin");
            modelBuilder.Entity<UserLogin>().HasIndex(c => c.Email).IsUnique();
            modelBuilder.Entity<UserLogin>().HasIndex(c => c.UserName).IsUnique();
        }
    }
}

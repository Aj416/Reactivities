using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.ActivityId, aa.AppUserId }));

            builder.Entity<ActivityAttendee>().HasOne(aa => aa.AppUser).WithMany(au => au.Activities).HasForeignKey(aa => aa.AppUserId);

            builder.Entity<ActivityAttendee>().HasOne(aa => aa.Activity).WithMany(a => a.Attendees).HasForeignKey(aa => aa.ActivityId);
        }
    }
}
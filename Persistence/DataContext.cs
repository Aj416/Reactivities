using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options)
            : base(options) { }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(
                x => x.HasKey(aa => new { aa.ActivityId, aa.AppUserId })
            );

            builder
                .Entity<ActivityAttendee>()
                .HasOne(aa => aa.AppUser)
                .WithMany(au => au.Activities)
                .HasForeignKey(aa => aa.AppUserId);

            builder
                .Entity<ActivityAttendee>()
                .HasOne(aa => aa.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId);

            builder
                .Entity<Comment>()
                .HasOne(c => c.Activity)
                .WithMany(a => a.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(uf =>
            {
                uf.HasKey(uf => new { uf.ObserverId, uf.TargetId });
                uf.HasOne(uf => uf.Observer)
                    .WithMany(au => au.Followings)
                    .HasForeignKey(uf => uf.ObserverId)
                    .OnDelete(DeleteBehavior.Cascade);
                uf.HasOne(uf => uf.Target)
                    .WithMany(au => au.Followers)
                    .HasForeignKey(uf => uf.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}

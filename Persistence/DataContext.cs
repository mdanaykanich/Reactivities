﻿using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
	public class DataContext : IdentityDbContext<AppUser>
	{
		public DataContext(DbContextOptions<DataContext> options) : base(options) { }

		public DbSet<Value> Values { get; set; }
		public DbSet<Activity> Activities { get; set; }
		public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
		public DbSet<Photo> Photos { get; set; }
		public DbSet<Comment> Comments { get; set; }
		public DbSet<UserFollowing> UserFollowings { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			modelBuilder.Entity<Value>()
				.HasData(
					new Value { Id = 1, Name = "Value 101" },
					new Value { Id = 2, Name = "Value 102" },
					new Value { Id = 3, Name = "Value 103" }
				);
			modelBuilder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.AppUserId, aa.ActivityId }));
			modelBuilder.Entity<ActivityAttendee>()
				.HasOne(u => u.AppUser)
				.WithMany(a => a.Activities)
				.HasForeignKey(aa => aa.AppUserId);
			modelBuilder.Entity<ActivityAttendee>()
				.HasOne(u => u.Activity)
				.WithMany(a => a.Attendees)
				.HasForeignKey(aa => aa.ActivityId);

			modelBuilder.Entity<Comment>()
				.HasOne(a => a.Activity)
				.WithMany(c => c.Comments)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<UserFollowing>(b =>
			{
				b.HasKey(k => new { k.ObserverId, k.TargetId });

				b.HasOne(o => o.Observer)
					.WithMany(f => f.Followings)
					.HasForeignKey(o => o.ObserverId)
					.OnDelete(DeleteBehavior.Cascade);

				b.HasOne(t => t.Target)
					.WithMany(f => f.Followers)
					.HasForeignKey(o => o.TargetId)
					.OnDelete(DeleteBehavior.Cascade);
			});

		}
	}
}
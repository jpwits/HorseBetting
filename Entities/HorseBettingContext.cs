using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace HorseBetting.Entities
{
    public partial class HorseBettingContext : DbContext
    {
        public HorseBettingContext()
        {
        }

        public HorseBettingContext(DbContextOptions<HorseBettingContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Event> Event { get; set; }
        public virtual DbSet<EventDetail> EventDetail { get; set; }
        public virtual DbSet<EventDetailStatus> EventDetailStatus { get; set; }
        public virtual DbSet<Tournament> Tournament { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=DESKTOP-4NM3MIF\\SQLEXPRESS;Initial Catalog=HorseBetting;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Event>(entity =>
            {
                entity.Property(e => e.EventId).HasColumnName("EventID");

                entity.Property(e => e.EventDateTime).HasColumnType("datetime");

                entity.Property(e => e.EventEndDateTime).HasColumnType("datetime");

                entity.Property(e => e.EventName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.FkTournamentId).HasColumnName("FK_TournamentID");

                entity.HasOne(d => d.FkTournament)
                    .WithMany(p => p.Event)
                    .HasForeignKey(d => d.FkTournamentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Event_Tournament");
            });

            modelBuilder.Entity<EventDetail>(entity =>
            {
                entity.Property(e => e.EventDetailId).HasColumnName("EventDetailID");

                entity.Property(e => e.EventDetailName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.EventDetailOdd).HasColumnType("decimal(18, 7)");

                entity.Property(e => e.FkEventDetailStatusId).HasColumnName("FK_EventDetailStatusID");

                entity.Property(e => e.FkEventId).HasColumnName("FK_EventID");

                entity.HasOne(d => d.FkEventDetailStatus)
                    .WithMany(p => p.EventDetail)
                    .HasForeignKey(d => d.FkEventDetailStatusId)
                    .HasConstraintName("FK_EventDetail_EventDetailStatus");

                entity.HasOne(d => d.FkEvent)
                    .WithMany(p => p.EventDetail)
                    .HasForeignKey(d => d.FkEventId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EventDetail_Event");
            });

            modelBuilder.Entity<EventDetailStatus>(entity =>
            {
                entity.Property(e => e.EventDetailStatusId).HasColumnName("EventDetailStatusID");

                entity.Property(e => e.EventDetailStatusName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Tournament>(entity =>
            {
                entity.Property(e => e.TournamentId).HasColumnName("TournamentID");

                entity.Property(e => e.TournamentName)
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

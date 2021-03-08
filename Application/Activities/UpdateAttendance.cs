using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
	public class UpdateAttendance
	{
		public class Command : IRequest<Result<Unit>>
		{
			public Guid Id { get; set; }
		}

		public class Handler : IRequestHandler<Command, Result<Unit>>
		{
			private readonly IUserAccessor _userAccessor;
			private readonly DataContext _context;
			public Handler(DataContext context, IUserAccessor userAccessor)
			{
				_context = context;
				_userAccessor = userAccessor;
			}
			public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
			{
				var activity = await _context.Activities
					.Include(a => a.Attendees)
					.ThenInclude(u => u.AppUser)
					.SingleOrDefaultAsync(x => x.Id == request.Id);

				if (activity == null) return null;

				var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

				if (user == null) return null;

				var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;
				var attendee = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

				if (attendee != null && hostUsername == user.UserName)
				{
					activity.IsCanceled = !activity.IsCanceled;
				}

				if (attendee != null && hostUsername != user.UserName)
				{
					activity.Attendees.Remove(attendee);
				}

				if (attendee == null)
				{
					attendee = new ActivityAttendee
					{
						AppUser = user,
						Activity = activity,
						IsHost = false
					};
					activity.Attendees.Add(attendee);
				}

				var result = await _context.SaveChangesAsync() > 0;

				return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
			}
		}
	}
}
using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
	public class Edit
	{
		public class Command : IRequest<Result<Unit>>
		{
			public string DisplayName { get; set; }
			public string Bio { get; set; }
		}

		public class CommandValidator : AbstractValidator<Command>
		{
			public CommandValidator()
			{
				RuleFor(c => c.DisplayName).NotEmpty();
			}
		}

		public class Handler : IRequestHandler<Command, Result<Unit>>
		{
			private readonly DataContext _context;
			private IMapper _mapper;
			private readonly IUserAccessor _userAccessor;

			public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
			{
				_context = context;
				_mapper = mapper;
				_userAccessor = userAccessor;
			}
			public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
			{
				var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

				if (user == null) return null;

				user.DisplayName = request.DisplayName;
				user.Bio = request.Bio;

				_context.Entry(user).State = EntityState.Modified;

				var result = await _context.SaveChangesAsync() > 0;

				if (!result) return Result<Unit>.Failure("Failed to update the user");

				return Result<Unit>.Success(Unit.Value);
			}
		}
	}
}
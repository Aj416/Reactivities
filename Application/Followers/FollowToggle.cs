using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUserName { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.TargetUserName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(
                Command request,
                CancellationToken cancellationToken
            )
            {
                var observer = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUserName()
                );

                var target = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == request.TargetUserName
                );

                if (observer == null || target == null)
                    return null;

                var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing { Observer = observer, Target = target };

                    _context.UserFollowings.Add(following);
                }
                else
                {
                    _context.UserFollowings.Remove(following);
                }

                var result = await _context.SaveChangesAsync() > 0;

                if (!result)
                    return Result<Unit>.Fail("Failed to follow / unfollow");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}

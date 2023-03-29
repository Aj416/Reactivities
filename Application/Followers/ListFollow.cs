using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class ListFollow
    {
        public class Query : IRequest<Result<List<ProfileDTO>>>
        {
            public string Predicate { get; set; }
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<ProfileDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<List<ProfileDTO>>> Handle(
                Query request,
                CancellationToken cancellationToken
            )
            {
                var profiles = new List<ProfileDTO>();

                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _context.UserFollowings
                            .Where(uf => uf.Target.UserName == request.UserName)
                            .Select(x => x.Observer)
                            .ProjectTo<ProfileDTO>(
                                _mapper.ConfigurationProvider,
                                new { currentUserName = _userAccessor.GetUserName() }
                            )
                            .ToListAsync();
                        break;

                    case "following":
                        profiles = await _context.UserFollowings
                            .Where(uf => uf.Observer.UserName == request.UserName)
                            .Select(x => x.Target)
                            .ProjectTo<ProfileDTO>(
                                _mapper.ConfigurationProvider,
                                new { currentUserName = _userAccessor.GetUserName() }
                            )
                            .ToListAsync();
                        break;
                }

                return Result<List<ProfileDTO>>.Success(profiles);
            }
        }
    }
}

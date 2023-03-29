using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class GetProfile
    {
        public class Query : IRequest<Result<ProfileDTO>>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ProfileDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor = userAccessor;
            }

            public DataContext Context { get; }

            public async Task<Result<ProfileDTO>> Handle(
                Query request,
                CancellationToken cancellationToken
            )
            {
                var user = await _context.Users
                    .ProjectTo<ProfileDTO>(
                        _mapper.ConfigurationProvider,
                        new { currentUserName = _userAccessor.GetUserName() }
                    )
                    .SingleOrDefaultAsync(x => x.UserName == request.UserName);

                return Result<ProfileDTO>.Success(user);
            }
        }
    }
}

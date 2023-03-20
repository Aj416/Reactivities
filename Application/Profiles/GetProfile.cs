using Application.Core;
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

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                Context = context;
            }

            public DataContext Context { get; }

            public async Task<Result<ProfileDTO>> Handle(
                Query request,
                CancellationToken cancellationToken
            )
            {
                var user = await _context.Users
                    .ProjectTo<ProfileDTO>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync(x => x.UserName == request.UserName);

                return Result<ProfileDTO>.Success(user);
            }
        }
    }
}

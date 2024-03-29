using Application.Core;
using Application.DTO;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDTO>>> { }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<ActivityDTO>>> Handle(
                Query request,
                CancellationToken cancellationToken
            )
            {
                var activities = await _context.Activities
                    .ProjectTo<ActivityDTO>(
                        _mapper.ConfigurationProvider,
                        new { currentUserName = _userAccessor.GetUserName() }
                    )
                    .OrderBy(a => a.Date)
                    .ToListAsync();

                var result = _mapper.Map<List<ActivityDTO>>(activities);

                return Result<List<ActivityDTO>>.Success(result);
            }
        }
    }
}

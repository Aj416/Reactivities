using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class DeletePhoto
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(
                DataContext dataContext,
                IPhotoAccessor photoAccessor,
                IUserAccessor userAccessor
            )
            {
                _userAccessor = userAccessor;
                _dataContext = dataContext;
                _photoAccessor = photoAccessor;
            }

            public async Task<Result<Unit>> Handle(
                Command request,
                CancellationToken cancellationToken
            )
            {
                var user = await _dataContext.Users
                    .Include(x => x.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                if (user == null)
                    return null;

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null)
                    return null;

                if (photo.IsMain)
                    return Result<Unit>.Fail("You cannot delete profile photo");

                var result = await _photoAccessor.DeletePhoto(photo.Id);

                if (result == null)
                    return Result<Unit>.Fail("Problem deleting photo from Cloudinary");

                user.Photos.Remove(photo);

                var response = await _dataContext.SaveChangesAsync() > 0;

                if (response)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Fail("Problem deleting photo from server");
            }
        }
    }
}

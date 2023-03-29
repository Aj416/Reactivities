using Application.DTO;
using Application.Profiles;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUserName = null;
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDTO>()
                .ForMember(
                    d => d.HostUserName,
                    o =>
                        o.MapFrom(
                            src => src.Attendees.FirstOrDefault(a => a.IsHost).AppUser.UserName
                        )
                );
            CreateMap<ActivityAttendee, UserDTO>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(src => src.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(src => src.AppUser.Bio))
                .ForMember(
                    d => d.Image,
                    o => o.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url)
                )
                .ForMember(
                    d => d.FollowersCount,
                    o => o.MapFrom(src => src.AppUser.Followers.Count)
                )
                .ForMember(
                    d => d.FollowingCount,
                    o => o.MapFrom(src => src.AppUser.Followings.Count)
                )
                .ForMember(
                    d => d.Following,
                    o =>
                        o.MapFrom(
                            src =>
                                src.AppUser.Followers.Any(
                                    x => x.Observer.UserName == currentUserName
                                )
                        )
                );
            CreateMap<AppUser, ProfileDTO>()
                .ForMember(
                    d => d.Image,
                    o => o.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url)
                )
                .ForMember(d => d.FollowersCount, o => o.MapFrom(src => src.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(src => src.Followings.Count))
                .ForMember(
                    d => d.Following,
                    o =>
                        o.MapFrom(
                            src => src.Followers.Any(x => x.Observer.UserName == currentUserName)
                        )
                );
            CreateMap<Comment, CommentDTO>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(src => src.Author.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(src => src.Author.UserName))
                .ForMember(
                    d => d.Image,
                    o => o.MapFrom(src => src.Author.Photos.FirstOrDefault(x => x.IsMain).Url)
                );
        }
    }
}

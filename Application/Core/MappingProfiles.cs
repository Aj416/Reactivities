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
                );
            CreateMap<AppUser, ProfileDTO>()
                .ForMember(
                    d => d.Image,
                    o => o.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url)
                );
        }
    }
}

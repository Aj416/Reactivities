using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> AddPhoto([FromForm] AddPhoto.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(string id)
        {
            return HandleResult(await Mediator.Send(new DeletePhoto.Command { Id = id }));
        }

        [HttpPost("{id}/setmain")]
        public async Task<IActionResult> SetPrimaryPhoto(string id)
        {
            return HandleResult(await Mediator.Send(new SetMainPhoto.Command { Id = id }));
        }
    }
}
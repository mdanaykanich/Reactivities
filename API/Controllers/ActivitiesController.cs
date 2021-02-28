using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	public class ActivitiesController : BaseApiController
	{
		[HttpGet]
		public async Task<IActionResult> List()
		{
			return HandleResult(await Mediator.Send(new List.Query()));
		}

		[Authorize]
		[HttpGet("{id}")]
		public async Task<IActionResult> Details(Guid id)
		{
			return HandleResult(await Mediator.Send(new Details.Query { Id = id }));

		}

		[HttpPost]
		public async Task<ActionResult<Unit>> Create(Activity activity)
		{
			return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<Unit>> Edit(Guid id, Activity activity)
		{
			activity.Id = id;
			return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
		}

		[HttpDelete("{id}")]
		public async Task<ActionResult<Unit>> Delete(Guid id)
		{
			return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
		}
	}
}
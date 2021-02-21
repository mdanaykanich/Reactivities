using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
	public class ExceptionMiddleware
	{
		private readonly ILogger<ExceptionMiddleware> _logger;
		public readonly IHostEnvironment _env;
		public readonly RequestDelegate _next;


		public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
		{
			_env = env;
			_next = next;
			_logger = logger;
		}

		public async Task InvokeAsync(HttpContext context)
		{
			try
			{
				await _next.Invoke(context);
			}
			catch (Exception ex)
			{
				_logger.LogInformation(context.Request.Method + " " + context.Request.Path);
				_logger.LogError(ex, ex.Message);
				context.Response.ContentType = "application/json";
				context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

				var response = _env.IsDevelopment()
					? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
					: new AppException(context.Response.StatusCode, "Server error");

				var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
				var json = JsonSerializer.Serialize(response, options);

				await context.Response.WriteAsync(json);
			}
		}

	}
}
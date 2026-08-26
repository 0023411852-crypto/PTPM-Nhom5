using CloudService.Application.DTOs.PackageSpecifications;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CloudService.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageSpecificationsController : ControllerBase
    {
        private readonly IPackageSpecificationService _service;

        public PackageSpecificationsController(IPackageSpecificationService service)
        {
            _service = service;
        }

        [HttpGet("Plan/{planId}")]
        public async Task<IActionResult> GetByPlanId(Guid planId)
        {
            var specs = await _service.GetByPlanIdAsync(planId);
            return Ok(specs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var spec = await _service.GetByIdAsync(id);
            if (spec == null) return NotFound();
            return Ok(spec);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreatePackageSpecificationDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePackageSpecificationDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}

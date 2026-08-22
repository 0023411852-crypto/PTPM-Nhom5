using AutoMapper;
using CloudService.Application.Common;
using CloudService.Application.DTOs.PartnerRequests;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CloudService.Application.Services
{
    public class PartnerRequestService : IPartnerRequestService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PartnerRequestService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<PartnerRequestDto> CreateAsync(CreatePartnerRequestDto dto)
        {
            var entity = new PartnerRequest
            {
                FullName = dto.FullName,
                Email = dto.Email,
                WebsiteUrl = dto.WebsiteUrl,
                PromotionMethod = dto.PromotionMethod,
                PromotionDetails = dto.PromotionDetails,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Repository<PartnerRequest>().AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task<PagedResponse<PartnerRequestDto>> GetAllAsync(PaginationFilter filter, string search = "", string status = "")
        {
            var repo = _unitOfWork.Repository<PartnerRequest>();
            var allData = await repo.GetAllAsync();
            var query = allData.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(x => x.FullName.ToLower().Contains(searchLower) || 
                                         x.Email.ToLower().Contains(searchLower) || 
                                         x.WebsiteUrl.ToLower().Contains(searchLower));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(x => x.Status == status);
            }

            var pagedData = query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var dtos = pagedData.Select(MapToDto).ToList();
            return new PagedResponse<PartnerRequestDto>(dtos, query.Count(), filter.PageNumber, filter.PageSize);
        }

        public async Task<PartnerRequestDto> UpdateStatusAsync(Guid id, UpdatePartnerRequestStatusDto dto)
        {
            var repo = _unitOfWork.Repository<PartnerRequest>();
            var entity = await repo.GetByIdAsync(id);
            if (entity == null)
            {
                throw new Exception("Partner Request not found");
            }

            entity.Status = dto.Status;
            entity.Notes = dto.Notes ?? string.Empty;

            repo.Update(entity);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(entity);
        }

        private PartnerRequestDto MapToDto(PartnerRequest entity)
        {
            return new PartnerRequestDto
            {
                Id = entity.Id,
                FullName = entity.FullName,
                Email = entity.Email,
                WebsiteUrl = entity.WebsiteUrl,
                PromotionMethod = entity.PromotionMethod,
                PromotionDetails = entity.PromotionDetails,
                Status = entity.Status,
                Notes = entity.Notes,
                CreatedAt = entity.CreatedAt
            };
        }
    }
}

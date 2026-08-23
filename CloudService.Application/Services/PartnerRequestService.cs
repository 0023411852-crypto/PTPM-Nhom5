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
                RequestedService = dto.RequestedService,
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
                RequestedService = entity.RequestedService,
                PromotionMethod = entity.PromotionMethod,
                PromotionDetails = entity.PromotionDetails,
                Status = entity.Status,
                Notes = entity.Notes,
                CreatedAt = entity.CreatedAt
            };
        }

        public async Task<byte[]> ExportToExcelAsync(string search = "", string status = "")
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

            var exportData = query.OrderByDescending(x => x.CreatedAt).ToList();

            using var workbook = new ClosedXML.Excel.XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Partner Requests");

            // Headers
            worksheet.Cell(1, 1).Value = "Mã Yêu Cầu";
            worksheet.Cell(1, 2).Value = "Họ và Tên";
            worksheet.Cell(1, 3).Value = "Email";
            worksheet.Cell(1, 4).Value = "Website URL";
            worksheet.Cell(1, 5).Value = "Gói Dịch Vụ Yêu Cầu";
            worksheet.Cell(1, 6).Value = "Cách Thức Quảng Bá";
            worksheet.Cell(1, 7).Value = "Trạng Thái";
            worksheet.Cell(1, 8).Value = "Ngày Gửi (UTC)";
            worksheet.Cell(1, 9).Value = "Ghi Chú";

            var headerRow = worksheet.Row(1);
            headerRow.Style.Font.Bold = true;
            headerRow.Style.Fill.BackgroundColor = ClosedXML.Excel.XLColor.LightGray;

            // Data rows
            for (int i = 0; i < exportData.Count; i++)
            {
                var row = i + 2;
                var item = exportData[i];
                worksheet.Cell(row, 1).Value = item.Id.ToString();
                worksheet.Cell(row, 2).Value = item.FullName;
                worksheet.Cell(row, 3).Value = item.Email;
                worksheet.Cell(row, 4).Value = item.WebsiteUrl;
                worksheet.Cell(row, 5).Value = item.RequestedService;
                worksheet.Cell(row, 6).Value = item.PromotionMethod;
                worksheet.Cell(row, 7).Value = item.Status;
                worksheet.Cell(row, 8).Value = item.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                worksheet.Cell(row, 9).Value = item.Notes;
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new System.IO.MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services
{
    public class SiteSettingService : ISiteSettingService
    {
        private readonly IGenericRepository<SiteSetting> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SiteSettingService(IGenericRepository<SiteSetting> repository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<SiteSettingDto>> GetAllSettingsAsync()
        {
            var settings = await _repository.GetAllAsync();
            
            // Auto seed if empty
            if (!settings.Any())
            {
                var defaultSettings = new List<SiteSetting>
                {
                    new SiteSetting { Key = "SiteName", Value = "CloudNova", Description = "Tên website" },
                    new SiteSetting { Key = "Slogan", Value = "Cloud Server Tốc Độ Cao", Description = "Khẩu hiệu ở trang chủ" },
                    new SiteSetting { Key = "FacebookLink", Value = "https://facebook.com/cloudnova", Description = "Link Fanpage" },
                    new SiteSetting { Key = "PhoneNumber", Value = "1900 1234", Description = "Số điện thoại hỗ trợ" }
                };

                foreach (var s in defaultSettings)
                {
                    await _repository.AddAsync(s);
                }
                await _unitOfWork.SaveChangesAsync();
                
                return _mapper.Map<List<SiteSettingDto>>(defaultSettings);
            }

            return _mapper.Map<List<SiteSettingDto>>(settings);
        }

        public async Task<bool> UpdateSettingAsync(string key, string value)
        {
            var settings = await _repository.GetAllAsync();
            var setting = settings.FirstOrDefault(x => x.Key == key);
            
            if (setting == null) return false;

            setting.Value = value;
            _repository.Update(setting);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}

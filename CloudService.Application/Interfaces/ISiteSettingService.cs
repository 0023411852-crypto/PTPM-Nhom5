using System.Collections.Generic;
using System.Threading.Tasks;
using CloudService.Application.DTOs;

namespace CloudService.Application.Interfaces
{
    public interface ISiteSettingService
    {
        Task<List<SiteSettingDto>> GetAllSettingsAsync();
        Task<bool> UpdateSettingAsync(string key, string value);
    }
}

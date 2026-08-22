using System;
using Microsoft.Data.SqlClient;

namespace Seeder
{
    class Program
    {
        static void Main(string[] args)
        {
            string connString = "Server=.\\SQLEXPRESS01;Database=CloudServiceDB;Trusted_Connection=True;TrustServerCertificate=True";
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
DELETE FROM MediaFiles;
INSERT INTO MediaFiles (Id, CreatedAt, FileName, FileUrl, FileSize, FileType, UpdatedAt)
VALUES 
(NEWID(), GETUTCDATE(), N'vps-thumbnail.jpg', N'https://lh3.googleusercontent.com/aida-public/AB6AXuCz8XOKNtn2nXKJtfydbw0FlVVMoYZSHd8vJRqVllFANYTs8uuXq4ixS3IujI-C2Nvdqc4-rMuyho-DdVJ5Qp64DCEYmKpvEP2r5zni0q_iGm9mIzAGuvxsz6up671iXAPYHCuPH514mL1-v_k5nKetYuq4q68jQ60SqIiPR5qvWxbXV3wFtNzv-lsgrpCNIDNh_BfLvsluKA1yTHIqgy-TuNmSEGqynidprYCDx-o9qkGxsXGFxw', N'245 KB', N'Hình ảnh', GETUTCDATE()),
(NEWID(), GETUTCDATE(), N'security-shield.png', N'https://lh3.googleusercontent.com/aida-public/AB6AXuAOWRh3zzd-oSA0M-XgAlp9neL0gl5mc3QEhPsnZx4sGvwmNV8bhV8R8vKFwzlBL7kn7EzTnTLW0eN_iohi-u2qfxtMy6DIaYR8GifbOsqarCRYl8S_csTyxVvxikp2O8QJdW5E6UZ4Za69wDHcCBPcfhgKoOBAGXrqbrrcygFSXS2S7Jh_i-BRPvBC7Z7sP3FMCcw3AYNqT62pp9rx9gPs6Qs3fWPLaDoUvz_Px0w0zi3S08sIdA', N'512 KB', N'Hình ảnh', GETUTCDATE()),
(NEWID(), GETUTCDATE(), N'avatar-user-1.jpg', N'https://lh3.googleusercontent.com/aida-public/AB6AXuCJK6N72BXs2YJj5oNTbkRQNIPZMl6meR6T6mfFXQXGJDBVVhZ0Ev9imIyT6OfaBAS36yhrB1EF2UwerruOzS0zDffAq9_NgUgdD8hE8P9Pkr8Fg5g0mK9zuf3J4dQx3BLjXn5AzX4qk9xIMhQIPymbj4t3ugNnvlwOZt_ibquw1ljDNGRsdKJ4HSyALZ-RvGynsoe0r5k9e6FsuFh8Q-EIeyp1XHMBfE5I9Sz7AjUJUeGGPTMxMg', N'120 KB', N'Hình ảnh', GETUTCDATE()),
(NEWID(), GETUTCDATE(), N'avatar-user-2.jpg', N'https://lh3.googleusercontent.com/aida-public/AB6AXuADkA9AdOvPADTVp_vrUcQZyg7tli4ED6hzwkS3FEB2IeJq9a69Z22baTff7XO5IuPwSUfUEvjHtWMtIKhnKod9YIAgLieV5n-FshHmKZasXIHDAzg-RDea5m4rkJ1XnXNs55xPylpIQRNo7hgG5qruhAbgcHtHLjXc2g78q91EdNMlqAmkyPOzE7Ibn7XGxR-d0YDYaZUV_c4bj-vWntPs6K5eeb_CRTcbXBL6eetIaTQtfjyDxg', N'135 KB', N'Hình ảnh', GETUTCDATE()),
(NEWID(), GETUTCDATE(), N'banner-promo.jpg', N'https://lh3.googleusercontent.com/aida-public/AB6AXuCbMEgEupdtqeNJbFCWOuVqd_GjuaVKzdIHU0ql9HU2j1MEyenAXeRddJMIGE7MUcNS8Uck3AfqjloPJhuk4ydEGDAKK_o-bKFfIqpmYJEQUj3Kypy0bk7ZsmbyI7ViTfVBTNqQLK0mEI48pStNag4v7FXjZXJrTd63vPNF2u_p8HRihk1UdYfhcGYFhAPZ2pyqal6y4Oqa5Ql-LGFPchxDabNPkIE5qw3ZXM0WSUwt8WSLwTip1w', N'890 KB', N'Hình ảnh', GETUTCDATE()),
(NEWID(), GETUTCDATE(), N'cloud-server.png', N'https://lh3.googleusercontent.com/aida-public/AB6AXuBOCaM618_L8wvckuuCRwIbLO4YBhcpgXtfvuSOxdu3Lsy6-cIP571uAixRrdTAnwZla5y-64mDh2ur749axxvDTLvvbHHd2FupknF4oOJhxp0iVlQsV6O1iAzH4e1kNCD-M6nfkm93BzVXXobmtOFA3hiKlGjViAYgJbRTZ2wVQGEBGbZowvIO3VrwudODWirTKqJlb_89NXVGiHHRru0N8Srz3HfOhwttucCEBk0xz3Eol2w3VQ', N'450 KB', N'Hình ảnh', GETUTCDATE());

DELETE FROM NewsArticles;
DECLARE @AuthorId UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM AppUsers);
IF @AuthorId IS NOT NULL
BEGIN
    INSERT INTO NewsArticles (Id, Title, Content, Slug, Category, ThumbnailUrl, IsPublished, ViewCount, AuthorId, CreatedAt, UpdatedAt)
    VALUES
    (NEWID(), N'VPS là gì? Hướng dẫn lựa chọn VPS phù hợp', N'Nội dung bài viết mẫu về VPS...', 'vps-la-gi-huong-dan-lua-chon-vps-phu-hop', N'Cloud', '', 1, 1200, @AuthorId, '2023-08-19', GETUTCDATE()),
    (NEWID(), N'Cảnh báo lỗ hổng bảo mật mới trên WordPress', N'Nội dung bài viết mẫu về Bảo mật...', 'canh-bao-lo-hong-bao-mat-moi-tren-wordpress', N'Bảo mật', '', 1, 856, @AuthorId, '2023-08-18', GETUTCDATE()),
    (NEWID(), N'Khái niệm cơ bản về Docker cho lập trình viên', N'', 'khai-niem-co-ban-ve-docker-cho-lap-trinh-vien', N'Kỹ thuật', '', 0, 0, @AuthorId, '2023-08-19', GETUTCDATE());
END
";
                    cmd.ExecuteNonQuery();
                }
            }
            Console.WriteLine("Media seeded successfully!");
        }
    }
}

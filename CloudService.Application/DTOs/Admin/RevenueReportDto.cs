namespace CloudService.Application.DTOs.Admin
{
    public class RevenueReportDto
    {
        public string Revenue { get; set; } = string.Empty;
        public string RevenueGrowth { get; set; } = string.Empty;
        public string Transactions { get; set; } = string.Empty;
        public string TransactionsGrowth { get; set; } = string.Empty;
        public string AOV { get; set; } = string.Empty;
        public string AOVGrowth { get; set; } = string.Empty;
        public string NewUsers { get; set; } = string.Empty;
        public string NewUsersGrowth { get; set; } = string.Empty;
        public List<ChartDataDto> BarChartData { get; set; } = new();
        public List<ServiceBreakdownDto> ServiceBreakdown { get; set; } = new();
    }

    public class ChartDataDto
    {
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
    }

    public class ServiceBreakdownDto
    {
        public string Name { get; set; } = string.Empty;
        public int Percentage { get; set; }
        public string ColorClass { get; set; } = string.Empty;
    }
}

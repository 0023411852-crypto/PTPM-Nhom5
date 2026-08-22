using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
    static async Task Main() {
        try {
            using var client = new HttpClient();
            var response = await client.GetAsync("http://localhost:5154/api/ServicePlans?PageNumber=1&PageSize=50");
            Console.WriteLine($"Status: {response.StatusCode}");
            var body = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Body: {body}");
        } catch (Exception ex) {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}

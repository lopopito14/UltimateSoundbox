using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace Company.Function
{
    public static class Soundbox
    {
        private static HttpClient _httpClient = new HttpClient();

        [FunctionName("soundbox")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            ILogger log,
            ExecutionContext context)
        {
            const string jsonFileName = "/soundbox.json";

            try
            {
                var json = await new StreamReader(context.FunctionAppDirectory + jsonFileName).ReadToEndAsync();
                return new OkObjectResult(json);
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
            }

            return new NotFoundObjectResult(jsonFileName);
        }

        [FunctionName("banner")]
        public static async Task<IActionResult> Banner(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "banner/{bundleId}")] HttpRequest req,
            string bundleId,
            ILogger log)
        {
            try
            {
                CloudBlob cloudBlockBlob = GetBlob("banners", $"bundle_{bundleId}", $"banner_{bundleId}.jpg");
                string url = cloudBlockBlob.Uri.ToString();

                string data = await GetBase64(url, "image/jpeg");
                return new OkObjectResult(data);
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
            }

            return new NotFoundObjectResult($"bundle_{bundleId}");
        }

        [FunctionName("character")]
        public static async Task<IActionResult> Character(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "character/{bundleId}/{characterId}")] HttpRequest req,
            string bundleId,
            string characterId,
            ILogger log)
        {
            try
            {
                CloudBlob cloudBlockBlob = GetBlob("characters", $"bundle_{bundleId}", $"character_{bundleId}_{characterId}.jpg");
                string url = cloudBlockBlob.Uri.ToString();

                string data = await GetBase64(url, "image/jpeg");
                return new OkObjectResult(data);
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
            }

            return new NotFoundObjectResult($"bundle_{bundleId} - character_{ bundleId }_{ characterId}.jpg");
        }

        [FunctionName("image")]
        public static async Task<IActionResult> Image(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "image/{bundleId}/{soundId}/{movieId}")] HttpRequest req,
            string bundleId,
            string soundId,
            string movieId,
            ILogger log)
        {
            try
            {
                CloudBlob cloudBlockBlob = GetBlob("images", $"bundle_{bundleId}", $"img_{bundleId}_{soundId}_{movieId}.jpg");
                string url = cloudBlockBlob.Uri.ToString();

                string data = await GetBase64(url, "image/jpeg");
                return new OkObjectResult(data);
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
            }

            return new NotFoundObjectResult($"bundle_{bundleId} - img_{bundleId}_{soundId}_{movieId}.jpg");
        }

        [FunctionName("sound")]
        public static async Task<IActionResult> Sound(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "sound/{bundleId}/{soundId}/{movieId}")] HttpRequest req,
            string bundleId,
            string soundId,
            string movieId,
            ILogger log)
        {
            try
            {
                CloudBlob cloudBlockBlob = GetBlob("sounds", $"bundle_{bundleId}", $"sound_{bundleId}_{soundId}_{movieId}.mp3");
                var sharedAccess = cloudBlockBlob.GetSharedAccessSignature(new SharedAccessBlobPolicy()
                {
                    Permissions = SharedAccessBlobPermissions.Read,
                    SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(1),
                });
                var url = string.Format("{0}{1}", cloudBlockBlob.Uri, sharedAccess);

                string data = await GetBase64(url, "audio/mpeg");
                return new OkObjectResult(data);
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
            }

            return new NotFoundObjectResult($"bundle_{bundleId} - sound_{bundleId}_{soundId}_{movieId}.mp3");
        }

        private static CloudBlob GetBlob(string container, string directory, string blobName)
        {
            string storageConnectionString = Environment.GetEnvironmentVariable("StorageConnectionString", EnvironmentVariableTarget.Process);

            CloudStorageAccount blobAccount = CloudStorageAccount.Parse(storageConnectionString);
            CloudBlobClient blobClient = blobAccount.CreateCloudBlobClient();

            CloudBlobContainer blobContainer = blobClient.GetContainerReference(container);
            CloudBlobDirectory blobDirectory = blobContainer.GetDirectoryReference(directory);

            return blobDirectory.GetBlockBlobReference(blobName);
        }

        private static async Task<string> GetBase64(string url, string mimeType)
        {
            var bytes = await _httpClient.GetByteArrayAsync(url);
            var base64 = Convert.ToBase64String(bytes);

            return $"data:{mimeType};base64,{base64}";
        }
    }
}

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
        private const string ImageMimeType = "image/jpeg";
        private const string AudioMimeType = "audio/mpeg";

        [FunctionName("soundbox")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest httpRequest,
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
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "banner/{bundleId}")] HttpRequest httpRequest,
            [Blob("banners/bundle_{bundleId}/banner_{bundleId}.jpg", FileAccess.Read)] Stream bannerStream,
            string bundleId,
            ILogger log)
        {
            try
            {
                return new OkObjectResult(await GetStreamContent(bannerStream, ImageMimeType));
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
            }

            return new NotFoundObjectResult($"bundle_{bundleId}");
        }

        [FunctionName("character")]
        public static async Task<IActionResult> Character(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "character/{bundleId}/{characterId}")] HttpRequest httpRequest,
            [Blob("characters/bundle_{bundleId}/character_{bundleId}_{characterId}.jpg", FileAccess.Read)] Stream characterStream,
            string bundleId,
            string characterId,
            ILogger log)
        {
            try
            {
                return new OkObjectResult(await GetStreamContent(characterStream, ImageMimeType));
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
            }

            return new NotFoundObjectResult($"bundle_{bundleId} - character_{ bundleId }_{ characterId}.jpg");
        }

        [FunctionName("image")]
        public static async Task<IActionResult> Image(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "image/{bundleId}/{soundId}/{movieId}")] HttpRequest httpRequest,
            [Blob("images/bundle_{bundleId}/img_{bundleId}_{soundId}_{movieId}.jpg", FileAccess.Read)] Stream imageStream,
            string bundleId,
            string soundId,
            string movieId,
            ILogger log)
        {
            try
            {
                return new OkObjectResult(await GetStreamContent(imageStream, ImageMimeType));
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
            }

            return new NotFoundObjectResult($"bundle_{bundleId} - img_{bundleId}_{soundId}_{movieId}.jpg");
        }

        [FunctionName("sound")]
        public static async Task<IActionResult> Sound(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "sound/{bundleId}/{soundId}/{movieId}")] HttpRequest httpRequest,
            [Blob("sounds/bundle_{bundleId}/img_{bundleId}_{soundId}_{movieId}.jpg", FileAccess.Read)] Stream imageStream,
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

                var stream = await _httpClient.GetStreamAsync(url);
                return new OkObjectResult(await GetStreamContent(stream, AudioMimeType));
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
            }

            return new NotFoundObjectResult($"bundle_{bundleId} - sound_{bundleId}_{soundId}_{movieId}.mp3");
        }

        private static CloudBlob GetBlob(string container, string directory, string blobName)
        {
            string storageConnectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage", EnvironmentVariableTarget.Process);

            CloudStorageAccount blobAccount = CloudStorageAccount.Parse(storageConnectionString);
            CloudBlobClient blobClient = blobAccount.CreateCloudBlobClient();

            CloudBlobContainer blobContainer = blobClient.GetContainerReference(container);
            CloudBlobDirectory blobDirectory = blobContainer.GetDirectoryReference(directory);

            return blobDirectory.GetBlockBlobReference(blobName);
        }

        private static async Task<string> GetStreamContent(Stream stream, string mimeType)
        {
            using (MemoryStream memoryStream = new MemoryStream())
            {
                await stream.CopyToAsync(memoryStream);
                var bytes = memoryStream.ToArray();
                var base64 = Convert.ToBase64String(bytes);

                return $"data:{mimeType};base64,{base64}";
            }
        }
    }
}

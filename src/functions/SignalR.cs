using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace Company.Function
{
    public static class SignalR
    {
        [FunctionName("negotiate")]
        public static SignalRConnectionInfo GetSignalRInfo(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [SignalRConnectionInfo(HubName = "chat", UserId = "{headers.name}")] SignalRConnectionInfo connectionInfo)
        {
            return connectionInfo;
        }

        [FunctionName("joinGroup")]
        public static Task JoinGroup(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] JoinGroupMessage joinGroupMessage,
            [SignalR(HubName = "chat")] IAsyncCollector<SignalRGroupAction> signalRGroupActions, ILogger log)
        {
            return signalRGroupActions.AddAsync(
                 new SignalRGroupAction
                 {
                     UserId = joinGroupMessage.userId,
                     GroupName = joinGroupMessage.groupId,
                     Action = GroupAction.Add
                 });
        }

        [FunctionName("leaveGroup")]
        public static Task LeaveGroup(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] LeaveGroupMessage leaveGroupMessage,
            [SignalR(HubName = "chat")] IAsyncCollector<SignalRGroupAction> signalRGroupActions, ILogger log)
        {
            return signalRGroupActions.AddAsync(
                 new SignalRGroupAction
                 {
                     UserId = leaveGroupMessage.userId,
                     GroupName = leaveGroupMessage.groupId,
                     Action = GroupAction.Remove
                 });
        }

        [FunctionName("personnalMessage")]
        public static Task SendPersonnalMessage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] PersonnalInMessage message,
            [SignalR(HubName = "chat")] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            return signalRMessages.AddAsync(
                new SignalRMessage
                {
                    UserId = message.userId,
                    Target = "personnalMessage",
                    Arguments = new[] {
                        new OutMessage{
                            sender = message.sender,
                            url = message.url
                        }
                    }
                });
        }

        [FunctionName("groupMessage")]
        public static Task SendGroupMessage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] GroupInMessage message,
            [SignalR(HubName = "chat")] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log)
        {
            return signalRMessages.AddAsync(
                new SignalRMessage
                {
                    GroupName = message.groupID,
                    Target = "groupMessage",
                    Arguments = new[] {
                        new OutMessage{
                            sender = message.sender,
                            url = message.url
                        }
                    }
                });
        }

        public class JoinGroupMessage
        {
            public string userId;

            public string groupId;
        }

        public class LeaveGroupMessage
        {
            public string userId;

            public string groupId;
        }

        public class PersonnalInMessage
        {
            public string sender;
            public string url;

            public string userId;
        }

        public class GroupInMessage
        {
            public string sender;
            public string url;

            public string groupID;
        }

        public class OutMessage
        {
            public string sender;
            public string url;
        }
    }
}

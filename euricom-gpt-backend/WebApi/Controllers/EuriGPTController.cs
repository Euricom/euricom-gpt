using Microsoft.AspNetCore.Mvc;
using Azure;
using Azure.AI.OpenAI;


namespace TodoApi.Controllers;

[ApiController]
[Route("[controller]")]
public class EuriGPTController : ControllerBase
{

    public EuriGPTController()
    {
    }

    [HttpPost(Name = "GetEuriGPT")]
    public async Task<IEnumerable<ChatCompletions>> Post([FromBody] Dictionary<string, List<string>> requestBody)
    {
        List<string> history = requestBody["history"];
        string? azureKeyCredential = Environment.GetEnvironmentVariable("AzureKeyCredential");
        if(string.IsNullOrEmpty(azureKeyCredential)){
            throw new ArgumentException("Misschien moet je wel het wachtwoord instellen !!!!!!!");

        }
        OpenAIClient client = new OpenAIClient(
            new Uri("https://euricom-gpt-model.openai.azure.com/"),
            new AzureKeyCredential(azureKeyCredential));

        ChatCompletionsOptions options = new ChatCompletionsOptions()
        {
            Messages = 
            {
                new ChatMessage(ChatRole.System, "You are an AI assistant that helps people find information. Your name is EuriGPT.")
            },
            Temperature = (float)0.7,
            MaxTokens = 800,
            NucleusSamplingFactor = (float)0.95,
            FrequencyPenalty = 0,
            PresencePenalty = 0,
            
        };
        history?.Select(x => new ChatMessage(ChatRole.System, x)).ToList().ForEach(options.Messages.Add);

        Response<ChatCompletions> responseWithoutStream = await client.GetChatCompletionsAsync(
            "euricom-gpt",
            options);


        ChatCompletions response = responseWithoutStream.Value;
        return [response];

    }
    
}

export interface ResponseBody {
    response: {
        content: string;
        response_metadata: {
            token_usage: {
                completion_tokens: number;
                prompt_tokens: number;
                total_tokens: number;
            };
            model_name: string;
        };
    };
}

import 'dotenv/config';
import OpenAI from 'openai';

async function main() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('❌ OPENAI_API_KEY is missing from process.env');
        return;
    }
    console.log('🔑 Found API Key:', apiKey.slice(0, 8) + '...');

    const openai = new OpenAI({ apiKey });

    try {
        console.log('📡 Sending test request to OpenAI...');
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Hello, are you working?' }],
            model: 'gpt-3.5-turbo',
        });
        console.log('✅ Success! Response:', completion.choices[0].message.content);
    } catch (error: any) {
        console.error('❌ Error testing API key:', error.message);
        if (error.code) console.error('Error Code:', error.code);
        if (error.type) console.error('Error Type:', error.type);
    }
}

main();

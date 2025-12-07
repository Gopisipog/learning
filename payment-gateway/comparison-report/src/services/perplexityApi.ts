import axios from 'axios';

// NOTE: Do NOT hard-code your Perplexity API key in source control.
// Configure `VITE_PERPLEXITY_API_KEY` in a local `.env` file instead.
const API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const API_URL = 'https://api.perplexity.ai/chat/completions';

export interface ComparisonResult {
  content: string;
  citations?: string[];
}

export async function getPaymentComparisonReport(): Promise<ComparisonResult> {
  const prompt = `Create a comprehensive comparison report between Payment Gateway Systems and POS (Point of Sale) Devices specifically for the INDIAN MARKET. Include the following sections:

1. **Overview**: Brief introduction to both technologies in the Indian context
2. **Key Features Comparison**: Compare features side by side relevant to Indian businesses
3. **Popular Indian Payment Gateways**: Razorpay, Paytm, CCAvenue, PayU, Cashfree, Instamojo, etc.
4. **Popular POS Providers in India**: Pine Labs, Mswipe, Paytm POS, PhonePe POS, BharatPe, etc.
5. **UPI Integration**: How each technology integrates with UPI (Unified Payments Interface)
6. **RBI Regulations & Compliance**: Security and regulatory requirements in India
7. **Cost Analysis in INR**: Pricing models, transaction fees, MDR rates for Indian market
8. **GST & Tax Considerations**: How each handles Indian tax requirements
9. **Use Cases for Indian Businesses**: Retail, restaurants, e-commerce, kirana stores, etc.
10. **Rural vs Urban Adoption**: Digital payment penetration across India
11. **Pros and Cons**: Advantages and disadvantages of each in Indian context
12. **Future Trends in India**: Digital India initiative, ONDC, RuPay growth, etc.
13. **Recommendation**: When to choose one over the other for Indian businesses

Please include specific pricing in INR, Indian payment methods (UPI, RuPay, Paytm, PhonePe, Google Pay), and compliance with RBI guidelines. Format the response in a clear, structured manner suitable for a business report.`;

	  try {
	    if (!API_KEY) {
	      throw new Error('Missing Perplexity API key. Set VITE_PERPLEXITY_API_KEY in your environment.');
	    }
    const response = await axios.post(
      API_URL,
      {
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a financial technology expert specializing in the Indian payment ecosystem. Provide detailed analysis on payment systems and devices specific to India, including UPI, RuPay, RBI regulations, and popular Indian fintech companies. Provide accurate, up-to-date information with clear comparisons and pricing in INR.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.2,
        return_citations: true
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      content: response.data.choices[0].message.content,
      citations: response.data.citations || []
    };
  } catch (error) {
    console.error('Error fetching comparison report:', error);
    throw error;
  }
}


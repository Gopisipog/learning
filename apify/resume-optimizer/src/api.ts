import axios from 'axios';
import { OptimizeRequest, OptimizeResponse } from './types';

const RAPIDAPI_KEY = '5358a0749dmshb2efb377c56fb46p153b38jsnfa4271a1a50b';
const RAPIDAPI_HOST = 'resumeoptimizerpro.p.rapidapi.com';

export async function optimizeResume(request: OptimizeRequest): Promise<OptimizeResponse> {
  const response = await axios.post('/api/rapidapi/optimize', request, {
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}


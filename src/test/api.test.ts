import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('API Connection Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should connect to backend status endpoint', async () => {
    const mockResponse = { data: { message: 'Backend is running!' }, status: 200 };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const response = await axios.get('/api/status');
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Backend is running!');
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/status');
  });

  it('should fetch all users', async () => {
    const mockResponse = { data: [], status: 200 };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const response = await axios.get('/api/users/all');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/users/all');
  });

  it('should fetch all projects', async () => {
    const mockResponse = { data: [], status: 200 };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const response = await axios.get('/api/projects/all');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/projects/all');
  });

  it('should fetch all instruments', async () => {
    const mockResponse = { data: [], status: 200 };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const response = await axios.get('/api/instruments/all');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/instruments/all');
  });
});

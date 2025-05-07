const axios = require('axios');
jest.mock('axios');

describe('Axios Unit Tests', () => {
    it('should make a successful GET request', async () => {
        // Mock the axios GET response
        const mockResponse = { data: { message: 'Success' } };
        axios.get.mockResolvedValue(mockResponse);

        // Simulate a GET request
        const response = await axios.get('/api/test');

        // Assertions
        expect(axios.get).toHaveBeenCalledWith('/api/test');
        expect(response.data).toEqual({ message: 'Success' });
    });

    it('should handle a GET request error', async () => {
        // Mock the axios GET error
        const mockError = new Error('Network Error');
        axios.get.mockRejectedValue(mockError);

        try {
            // Simulate a GET request
            await axios.get('/api/test');
        } catch (error) {
            // Assertions
            expect(axios.get).toHaveBeenCalledWith('/api/test');
            expect(error).toEqual(mockError);
        }
    });

    it('should make a successful POST request', async () => {
        // Mock the axios POST response
        const mockResponse = { data: { id: 1, message: 'Created' } };
        axios.post.mockResolvedValue(mockResponse);

        // Simulate a POST request
        const payload = { name: 'Test' };
        const response = await axios.post('/api/test', payload);

        // Assertions
        expect(axios.post).toHaveBeenCalledWith('/api/test', payload);
        expect(response.data).toEqual({ id: 1, message: 'Created' });
    });

    it('should handle a POST request error', async () => {
        // Mock the axios POST error
        const mockError = new Error('Request failed');
        axios.post.mockRejectedValue(mockError);

        try {
            // Simulate a POST request
            await axios.post('/api/test', { name: 'Test' });
        } catch (error) {
            // Assertions
            expect(axios.post).toHaveBeenCalledWith('/api/test', { name: 'Test' });
            expect(error).toEqual(mockError);
        }
    });
});

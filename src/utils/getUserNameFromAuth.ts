export async function getUserFromAuthCookie() {
    try {
        const response = await fetch('/api/private/users/auth', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data: ' + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return null;
    }
}
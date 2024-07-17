document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('user-list');
    const searchInput = document.getElementById('search');
    const userForm = document.getElementById('user-form'); 

    let users = []; 

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const usersFromAPI = await response.json();
            console.log(usersFromAPI); 
            return usersFromAPI;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    };

    const renderUsers = (users) => {
        userList.innerHTML = '';
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.classList.add('user-card');
            userCard.innerHTML = `
                <h3>${user.name}</h3>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>City:</strong> ${user.address.city}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Company:</strong> ${user.company.name}</p>
            `;
            userList.appendChild(userCard);
        });
    };

    const filterUsers = (users, query) => {
        return users.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.address.city.toLowerCase().includes(query.toLowerCase()) ||
            user.phone.toLowerCase().includes(query.toLowerCase()) ||
            user.company.name.toLowerCase().includes(query.toLowerCase())
        );
    };

    const loadAndRenderUsers = async () => {
        users = await fetchUsers();
        renderUsers(users);

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            console.log(`Searching for: ${query}`);
            const filteredUsers = filterUsers(users, query);
            renderUsers(filteredUsers);
        });
    };

    userForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const formData = new FormData(userForm);
        const newUser = {
            name: formData.get('name'),
            username: formData.get('username'),
            email: formData.get('email'),
            address: { city: formData.get('city') },
            phone: formData.get('phone'),
            company: { name: formData.get('company') }
        };

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                const addedUser = await response.json();
                users.push(addedUser);
                renderUsers(users);
                userForm.reset();
            } else {
                console.error('Error al agregar usuario:', response.statusText);
            }
        } catch (error) {
            console.error('Error al enviar la petición:', error);
        }
    });

    loadAndRenderUsers(); 
});

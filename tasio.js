const tasio = {
	replace: (path) => {
		try {
			path = path || 'src/plugins/icons/data-icon';
			const icons = document.querySelectorAll('[data-icon]');

			icons.forEach((icon) => {
				const iconName = icon.getAttribute('data-icon');
				const iconPath = `${path}/${iconName}.svg`;
				fetch(iconPath)
					.then((response) => response.text())
					.then((data) => {
						icon.innerHTML = data;
					});
			});
		} catch (error) {
			console.error(error);
		}
	},
};

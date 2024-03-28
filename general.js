document.querySelectorAll('.item-description').forEach(function(itemDescription) {
	var itemDescriptionCopy = itemDescription.querySelector('.item-description-copy');
	var readMoreLink = itemDescription.querySelector('.read-more');
	
	var isOverflowing = itemDescriptionCopy.scrollHeight > itemDescriptionCopy.offsetHeight;

	if (isOverflowing) {
		readMoreLink.style.display = 'inline';
	} else {
		readMoreLink.style.display = 'none';
	}

	readMoreLink.addEventListener('click', function(e) {
		e.preventDefault();
		itemDescriptionCopy.classList.remove('item-description-copy');
		readMoreLink.style.display = 'none';
	});
});

// contact creation variables
var uploadImage = document.getElementById("uploadImage");
var fullName = document.getElementById("fullName");
var phoneNumber = document.getElementById("phoneNumber");
var emailAddress = document.getElementById("emailAddress");
var address = document.getElementById("address");
var groupValue = document.getElementById("group");
var contactNotes = document.getElementById("notes");
var favoriteCheckbox = document.getElementById("favorite");
var emergencyCheckbox = document.getElementById("emergency");
var cancelBtn = document.getElementById("cancelContact");
var saveContactBtn = document.getElementById("saveContact");
var modal = document.getElementById("exampleModal");
// contacts stats variables
var totalCount = document.getElementById("totalCount");
var favoritesCount = document.getElementById("favoritesCount");
var emergencyCount = document.getElementById("emergencyCount");
var totalContactsCount = document.getElementById("totalContactsCount");
var searchInput = document.getElementById("searchInput");
var contactsContainer = document.getElementById("contactsContainer");
// contact card variables
var contactAvatar = document.getElementById("cardContactAvatar");
var cardContactName = document.getElementById("cardContactName");
var cardPhoneNumber = document.getElementById("cardPhoneNumber");
var cardEmailInfo = document.getElementById("cardEmailInfo");
var cardAddressInfo = document.getElementById("cardAddressInfo");
var cardGroupType = document.getElementById("cardGroupType");
var cardCallBtn = document.getElementById("cardCallBtn");
var cardEmailToBtn = document.getElementById("cardEmailToBtn");
var favoriteBtn = document.getElementById("favoriteBtn");
var emergencyBtn = document.getElementById("emergencyBtn");
var editBtn = document.getElementById("editBtn");
var deleteBtn = document.getElementById("deleteBtn");
// fav / emergency cards container variables
var favoriteContactsBody = document.getElementById("favoriteContactsBody");
var emergencyContactsBody = document.getElementById("emergencyContactsBody");

var contactList = [];
var favoriteList = [];
var emergencyList = [];

var updatedContactIndex;
var oldContactNumber = "";

if (localStorage.getItem("contacts") != null) {
  contactList = JSON.parse(localStorage.getItem("contacts"));
}

if (localStorage.getItem("favorites") != null) {
  favoriteList = JSON.parse(localStorage.getItem("favorites"));
}

if (localStorage.getItem("emergencies") != null) {
  emergencyList = JSON.parse(localStorage.getItem("emergencies"));
}

displayContact();
displayFavorite();
displayEmergency();
updateCounters();

function createContact() {
  var isDuplicated = false;

  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].number == phoneNumber.value.trim()) {
      isDuplicated = true;
      break;
    }
  }

  if (
    validateName() == true &&
    validateNumber() == true &&
    isDuplicated == false
  ) {
    var contact = {
      name: fullName.value.trim(),
      number: phoneNumber.value.trim(),
      email: emailAddress.value.trim(),
      address: address.value.trim(),
      group: groupValue.value.trim(),
      notes: contactNotes.value.trim(),
      favorite: favoriteCheckbox.checked, // boolean value
      emergency: emergencyCheckbox.checked,
      contactAvatar: uploadImage.files[0]
        ? `./images/${uploadImage.files[0].name}`
        : "",
    };

    contactList.push(contact);

    if (favoriteCheckbox.checked == true) {
      favoriteList.push(contact);
    }

    if (emergencyCheckbox.checked == true) {
      emergencyList.push(contact);
    }

    localStorage.setItem("contacts", JSON.stringify(contactList));
    localStorage.setItem("favorites", JSON.stringify(favoriteList));
    localStorage.setItem("emergencies", JSON.stringify(emergencyList));

    console.log(contactList);

    updateCounters();
    displayContact();

    if (favoriteCheckbox.checked == true) {
      displayFavorite();
    }

    if (emergencyCheckbox.checked == true) {
      displayEmergency();
    }

    clearInput();

    Swal.fire({
      title: "Added!",
      text: "Your contact has been added.",
      icon: "success",
      timer: 1500,
    });

    bootstrap.Modal.getInstance(modal).hide();
  } else {
    if (fullName.value.trim() == "") {
      Swal.fire({
        title: "Missing Name",
        text: "Please enter a name for the contact!",
        icon: "error",
      });
    } else if (phoneNumber.value.trim() == "") {
      Swal.fire({
        title: "Missing Phone",
        text: "Please enter a phone number!",
        icon: "error",
      });
    } else if (validateName() == false) {
      Swal.fire({
        title: "Invalid Name",
        text: "Name should contain only letters and spaces (2-50 characters)",
        icon: "error",
      });
    } else if (validateNumber() == false) {
      Swal.fire({
        title: "Invalid Phone",
        text: "Please enter a valid Egyptian phone number.",
        icon: "error",
      });
    } else if (isDuplicated == true) {
      Swal.fire({
        title: "Duplicated Phone Number",
        text: `A contact with this phone number already exists:\n${fullName.value}`,
        icon: "error",
      });
    }
  }
}

function clearInput() {
  fullName.value = "";
  phoneNumber.value = "";
  emailAddress.value = "";
  address.value = "";
  groupValue.value = "";
  contactNotes.value = "";
  favoriteCheckbox.checked = false;
  emergencyCheckbox.checked = false;
  uploadImage.value = "";
}

function displayContact() {
  var searchTerm = searchInput.value.toLowerCase();
  var content = "";

  for (var i = 0; i < contactList.length; i++) {
    var nameArray = contactList[i].name.split(" ");
    var initials = "";

    for (var j = 0; j < nameArray.length; j++) {
      initials += nameArray[j][0];
    }

    var isFavorite = false;

    for (var k = 0; k < favoriteList.length; k++) {
      if (contactList[i].name == favoriteList[k].name) {
        isFavorite = true;
        break;
      }
    }

    var isEmergency = false;

    for (var z = 0; z < emergencyList.length; z++) {
      if (contactList[i].name == emergencyList[z].name) {
        isEmergency = true;
        break;
      }
    }

    if (
      contactList[i].name.toLowerCase().includes(searchTerm) ||
      contactList[i].number.toLowerCase().includes(searchTerm) ||
      contactList[i].email.toLowerCase().includes(searchTerm)
    ) {
      content += `
      <div class="col-12 col-lg-6">
                      <div
                        class="inner card border-0 bg-white rounded-4 h-100"
                      >
                        <div class="card-body d-flex flex-column gap-3">
                          <!-- contact title -->
                          <div class="d-flex align-items-center gap-3">
                            <div class="contact-avatar" id="cardContactAvatar">
                              ${
                                contactList[i].contactAvatar
                                  ? `<img src="${contactList[i].contactAvatar}" 
                                          alt="${contactList[i].name}" 
                                          class="object-fit-cover w-100 h-100 rounded-3">`
                                  : initials.toUpperCase()
                              }  

                             <div class="fav-badge contact-badge ${isFavorite ? "" : "invisible"}">
                                <i
                                  class="fa-solid fa-star"
                                ></i>
                              </div>

                              <div class="emergency-badge contact-badge ${isEmergency ? "" : "invisible"}">
                                <i
                                  class="fa-solid fa-heart-pulse"
                                ></i>
                              </div>

                            </div>
                            <div class="contact-info" id="contactInfo">
                              <h5
                                class="mb-2 fs-6 fw-semibold"
                                id="cardContactName"
                              >
                                ${contactList[i].name}
                              </h5>
                              <div class="d-flex align-items-center gap-2">
                                <div class="icon">
                                  <i class="fa fa-phone"></i>
                                </div>
                                <span id="cardPhoneNumber">${contactList[i].number}</span>
                              </div>
                            </div>
                          </div>
                          <!-- email info -->
                          <div
                            id="emailContainer"
                            class="email-info d-flex align-items-center gap-2"
                          >
                            <div class="icon ${contactList[i].email == "" ? "invisible" : ""}">
                              <i class="fa fa-envelope"></i>
                            </div>
                            <span id="cardEmailInfo"
                              >${contactList[i].email}</span
                            >
                          </div>
                          <!-- address info -->
                          <div
                            id="addressContainer"
                            class="address-info d-flex align-items-center gap-2"
                          >
                            <div class="icon ${contactList[i].address == "" ? "invisible" : ""}">
                              <i class="fa-solid fa-location-dot"></i>
                            </div>
                            <span id="cardAddressInfo">${contactList[i].address}</span>
                          </div>
                          <!-- group and emergency badges -->
                          <div class="d-flex align-items-center gap-2 flex-wrap">

                            <span
                              id="cardGroupType"
                              class="group-badge group-${contactList[i].group.toLowerCase()} ${contactList[i].group == "" ? "d-none" : ""}"
                            >
                              ${contactList[i].group}
                            </span>

                            ${
                              isEmergency
                                ? `
                                  <span class="emergency-label">
                                    <i class="fa-solid fa-heart-pulse"></i>
                                    Emergency
                                  </span>
                                `
                                : ""
                            }

                          </div>
                        </div>

                        <!-- card footer -->
                        <div
                          class="card-footer rounded-bottom-4 border-0 d-flex align-items-center justify-content-between py-3"
                        >
                          <div class="icons d-flex align-items-center gap-2">
                            <a
                              href="tel:${contactList[i].number}"
                              class="text-decoration-none call-link"
                              id="cardCallBtn"
                            >
                              <i class="fa fa-phone"></i>
                            </a>
                            <a
                              href="mailto:${contactList[i].email}"
                              class="text-decoration-none mail-link ${contactList[i].email == "" ? "d-none" : ""}"
                              id="cardEmailToBtn"
                            >
                              <i class="fa fa-envelope"></i>
                            </a>
                          </div>

                          <!-- action buttons -->
                          <div class="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              id="favoriteBtn"
                              class="contact-action-btn ${isFavorite ? "favorite-btn-active" : "favorite-btn"}"
                              title="Add to Favorites"
                              onclick="addToFavorite(${i})"
                            >
                              <i class="fa-regular fa-star"></i>
                            </button>

                            <button
                              type="button"
                              id="emergencyBtn"
                              class="contact-action-btn ${isEmergency ? "emergency-btn-active" : "emergency-btn"}"
                              title="Add to Emergency"
                              onclick="addToEmergency(${i})"
                            >
                              <i class="fa-regular fa-heart"></i>
                            </button>

                            <!-- Right Buttons -->
                            <button
                              type="button"
                              id="editBtn"
                              class="contact-action-btn edit-btn"
                              title="Edit Contact"
															onclick="editContactInfo(${i})"
                            >
                              <i class="fa-solid fa-pen"></i>
                            </button>

                            <button
                              type="button"
                              id="deleteBtn"
                              class="contact-action-btn delete-btn"
                              title="Delete Contact"
                              onclick="deleteContact(${i})"
                            >
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
			`;
    }
  }
  contactsContainer.innerHTML = content;
}

function displayEmergency() {
  var content = "";

  for (var i = 0; i < emergencyList.length; i++) {
    var nameArray = emergencyList[i].name.split(" ");
    var initials = "";

    for (var j = 0; j < nameArray.length; j++) {
      initials += nameArray[j][0];
    }

    content += `
      <div class="small-contact-card emergency-contact-card d-flex align-items-center justify-content-between p-3 rounded-4 mb-2">
        <div class="d-flex align-items-center gap-3">
          <div class="contact-avatar overflow-hidden">
            ${
              emergencyList[i].contactAvatar
                ? `<img src="${emergencyList[i].contactAvatar}" 
                        class="w-100 h-100 object-fit-cover"
                        alt="${emergencyList[i].name}">`
                : initials.toUpperCase()
            }
          </div>

          <div class="contact-info">
            <h6 class="m-0">${emergencyList[i].name}</h6>
            <p class="m-0">${emergencyList[i].number}</p>
          </div>
        </div>

        <a href="tel:${emergencyList[i].number}" class="call-btn emergency-call-btn border-0 rounded-3 text-decoration-none">
          <i class="fa-solid fa-phone"></i>
        </a>
      </div>
    `;
  }

  if (emergencyList.length == 0) {
    emergencyContactsBody.innerHTML = `
      <span class="text-center d-block py-4">
        No emergency contacts
      </span>
    `;
  } else {
    emergencyContactsBody.innerHTML = content;
  }
}

function displayFavorite() {
  var content = "";

  for (var i = 0; i < favoriteList.length; i++) {
    var nameArray = favoriteList[i].name.split(" ");
    var initials = "";

    for (var j = 0; j < nameArray.length; j++) {
      initials += nameArray[j][0];
    }

    content += `
      <div class="small-contact-card d-flex align-items-center justify-content-between p-3 rounded-4 mb-2">
        <div class="d-flex align-items-center gap-3">
          <div class="contact-avatar overflow-hidden">
            ${
              favoriteList[i].contactAvatar
                ? `<img src="${favoriteList[i].contactAvatar}"
                        class="w-100 h-100 object-fit-cover"
                        alt="${favoriteList[i].name}">`
                : initials.toUpperCase()
            }
          </div>

          <div class="contact-info">
            <h6 class="m-0">${favoriteList[i].name}</h6>
            <p class="m-0">${favoriteList[i].number}</p>
          </div>
        </div>

        <a href="tel:${favoriteList[i].number}" class="call-btn border-0 rounded-3 text-decoration-none">
          <i class="fa-solid fa-phone"></i>
        </a>
      </div>
    `;
  }

  if (favoriteList.length == 0) {
    favoriteContactsBody.innerHTML = `
      <span class="text-center d-block py-4">
        No favorites yet
      </span>
    `;
  } else {
    favoriteContactsBody.innerHTML = content;
  }
}

function deleteContact(index) {
  console.log(index);
  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${contactList[index].name}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#606773",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      var deletedContact = contactList[index];
      contactList.splice(index, 1);

      if (favoriteList.includes(deletedContact)) {
        favoriteList.splice(favoriteList.indexOf(deletedContact), 1);
      }
      if (emergencyList.includes(deletedContact)) {
        emergencyList.splice(emergencyList.indexOf(deletedContact), 1);
      }

      localStorage.setItem("contacts", JSON.stringify(contactList));
      localStorage.setItem("favorites", JSON.stringify(favoriteList));
      localStorage.setItem("emergencies", JSON.stringify(emergencyList));

      displayContact();
      updateCounters();
      displayFavorite();
      displayEmergency();

      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

function editContactInfo(index) {
  updatedContactIndex = index;
  oldContactNumber = contactList[index].number;
  bootstrap.Modal.getOrCreateInstance(modal).show();

  fullName.value = contactList[index].name;
  phoneNumber.value = contactList[index].number;
  emailAddress.value = contactList[index].email;
  address.value = contactList[index].address;
  groupValue.value = contactList[index].group;
  contactNotes.value = contactList[index].notes;
  favoriteCheckbox.checked = contactList[index].favorite;
  emergencyCheckbox.checked = contactList[index].emergency;

  document.querySelector("#updateContact").classList.remove("d-none");
  document.querySelector("#updateContact").classList.add("d-block");

  saveContactBtn.classList.add("d-none");
}

function updateContact() {
  var contact = {
    name: fullName.value.trim(),
    number: phoneNumber.value.trim(),
    email: emailAddress.value.trim(),
    address: address.value.trim(),
    group: groupValue.value.trim(),
    notes: contactNotes.value.trim(),
    favorite: favoriteCheckbox.checked,
    emergency: emergencyCheckbox.checked,
     contactAvatar: uploadImage.files[0]
    ? `./images/${uploadImage.files[0].name}`
    : contactList[updatedContactIndex].contactAvatar,
  };

  contactList.splice(updatedContactIndex, 1, contact);

  // Update Favorite 
  var favoriteIndex = -1;

  for (var i = 0; i < favoriteList.length; i++) {
    if (favoriteList[i].number == oldContactNumber) {
      favoriteIndex = i;
      break;
    }
  }

  if (contact.favorite == true) {
    if (favoriteIndex == -1) {
      favoriteList.push(contact);
    } else {
      favoriteList.splice(favoriteIndex, 1, contact);
    }
  } else {
    if (favoriteIndex != -1) {
      favoriteList.splice(favoriteIndex, 1);
    }
  }

  // Update Emergency 
  var emergencyIndex = -1;

  for (var i = 0; i < emergencyList.length; i++) {
    if (emergencyList[i].number == oldContactNumber) {
      emergencyIndex = i;
      break;
    }
  }

  if (contact.emergency == true) {
    if (emergencyIndex == -1) {
      emergencyList.push(contact);
    } else {
      emergencyList.splice(emergencyIndex, 1, contact);
    }
  } else {
    if (emergencyIndex != -1) {
      emergencyList.splice(emergencyIndex, 1);
    }
  }

  localStorage.setItem("contacts", JSON.stringify(contactList));
  localStorage.setItem("favorites", JSON.stringify(favoriteList));
  localStorage.setItem("emergencies", JSON.stringify(emergencyList));

  displayContact();
  displayFavorite();
  displayEmergency();
  updateCounters();

  bootstrap.Modal.getOrCreateInstance(modal).hide();

  Swal.fire({
    title: "Updated!",
    text: "Contact has been updated successfully.",
    icon: "success",
    timer: 1500,
  });

  document.querySelector("#updateContact").classList.add("d-none");
  document.querySelector("#updateContact").classList.remove("d-block");

  saveContactBtn.classList.remove("d-none");
  saveContactBtn.classList.add("d-block");
}

function addToFavorite(index) {
  var isFavorite = false;

  for (var i = 0; i < favoriteList.length; i++) {
    if (contactList[index].number == favoriteList[i].number) {
      favoriteList.splice(i, 1);
      isFavorite = true;
      break;
    }
  }

  if (isFavorite == false) {
    favoriteList.push(contactList[index]);
  }

  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].number == contactList[index].number) {
      contactList[i].favorite = isFavorite == false;
    }
  }

  localStorage.setItem("favorites", JSON.stringify(favoriteList));
  localStorage.setItem("contacts", JSON.stringify(contactList));

  displayFavorite();
  displayContact();
  updateCounters();
}

function addToEmergency(index) {
  var isEmergency = false;

  for (var i = 0; i < emergencyList.length; i++) {
    if (contactList[index].number == emergencyList[i].number) {
      emergencyList.splice(i, 1);
      isEmergency = true;
      break;
    }
  }

  if (isEmergency == false) {
    emergencyList.push(contactList[index]);
  }

  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].number == contactList[index].number) {
      contactList[i].emergency = isEmergency == false;
    }
  }

  localStorage.setItem("emergencies", JSON.stringify(emergencyList));
  localStorage.setItem("contacts", JSON.stringify(contactList));

  displayEmergency();
  displayContact();
  updateCounters();
}

function updateCounters() {
  totalCount.innerHTML = contactList.length;
  totalContactsCount.innerHTML = contactList.length;
  favoritesCount.innerHTML = favoriteList.length;
  emergencyCount.innerHTML = emergencyList.length;
}

// validation functions

function validateName() {
  var nameError = document.getElementById("nameError");
  var regex = /^[A-Za-z ]{2,50}$/;

  if (fullName.value.trim() == "") {
    nameError.classList.add("d-none");
    fullName.classList.remove("is-invalid");
    return false;
  }

  if (regex.test(fullName.value.trim())) {
    nameError.classList.add("d-none");
    fullName.classList.remove("is-invalid");
    return true;
  } else {
    nameError.classList.remove("d-none");
    fullName.classList.add("is-invalid");
    return false;
  }
}

function validateNumber() {
  var numberError = document.getElementById("numberError");
  var regex = /^(002|\+2)?01[0125][0-9]{8}$/;

  if (phoneNumber.value.trim() == "") {
    numberError.classList.add("d-none");
    phoneNumber.classList.remove("is-invalid");
    return false;
  }

  if (regex.test(phoneNumber.value.trim())) {
    numberError.classList.add("d-none");
    phoneNumber.classList.remove("is-invalid");
    return true;
  } else {
    numberError.classList.remove("d-none");
    phoneNumber.classList.add("is-invalid");
    return false;
  }
}

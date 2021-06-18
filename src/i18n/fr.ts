/* eslint-disable max-len  */
/* eslint-disable @typescript-eslint/camelcase */

export const texts = {
  types: {
    event: 'Évènement',
    categoryHelpList: {
      mat_help: 'Un don matériel',
      other: 'Autre chose',
      resource: 'Un service',
      social: 'Des voisins pour entourer une personne',
    },
    categoryContributionList: {
      mat_help: 'Faire un don matériel',
      other: 'Aider à ma façon',
      resource: 'Offrir un service',
      social: 'Passer du temps avec une personne',
    },
    pois: {
      other: 'Autre',
      eating: 'Se nourrir',
      sleeping: 'Se loger',
      healing: 'Se soigner',
      orientation: 'S\'orienter',
      reintegration: 'Se réinsérer',
      partners: 'Partenaires',
      toilets: 'Toilettes',
      fountains: 'Fontaines',
      showers: 'Douches',
      laundries: 'Laveries',
      well_being: 'Bien-être & activités',
      clothes: 'Vêtements & matériels',
      cloakroom: 'Bagageries',
      donation_box: 'Boîtes à dons & lire',
      donations: 'Recherchant des dons',
      volunteers: 'Recherchant des bénévoles',
    },
  },
  form: {
    REQUIRED: 'Champs requis',
    INVALID_FORMAT: 'Format incorrect',
    PASSWORD_CONFIRMATION_NOT_MATCH: 'Confirmation invalide',
    INVALID_PASSWORD: 'Mot de passe invalide',
    INVALID_SMS_CODE: 'Code SMS invalide',
    PASSWORD_TOO_SHORT: 'Mot de passe trop court',
    // old
    FIELD_REQUIRED: 'Champs requis',
    EMAIL_REQUIRED: 'Format incorrect, veuillez entrer un email',
    PHONE_EXIST: 'Votre numéro exist déjà',
    BAD_FORMAT: 'Format incorrect',
    INCORRECT_VALUE: 'Valeur incorrecte',
  },
  nav: {
    pageTitles: {
      main: 'Entourage, le réseau solidaire',
      actions: 'Actions solidaires',
      pois: 'Lieux solidaires',
      messages: 'Messages',
    },
    pageDescriptions: {
      main: 'Rejoignez le réseau solidaire Entourage, pour venir en aide aux personnes isolées en précarité de votre quartier !',
      pois: 'Retrouvez toutes les structures solidaires de votre quartier sur la carte des lieux solidaires de notre application !',
      actions: 'Retrouvez toutes les actions solidaires autour de vous, ou proposez la votre pour venir en aide aux personnes isolées en précarité de votre quartier !',
    },
    actions: 'Actions',
    pois: 'Lieux solidaires',
    messages: 'Messages',
    takeAction: 'Passer à l\'action',
    profile: 'Mon profil',
    signIn: 'Connexion / Inscription',
    logout: 'Déconnexion',
    manage: 'Gérer',
    error: {
      message: 'Désolé, la page demandée est introuvable...',
      back: 'Retour à l\'accueil',
    },
  },
  labels: {
    save: 'Enregistrer',
    chooseImage: 'Choisir une image',
    changeImage: 'Changer d\'image',
    validateImage: 'Valider l\'image',
    validate: 'Valider',
  },
  content: {
    map: {
      filters: {
        events: 'Évènements',
        actionTypes: 'Types d\'action',
        updatedBefore: 'Mis à jour il y a moins de ...',
        contribution: {
          title: 'Voir les contributions concernant',
        },
        ask_for_help: {
          title: 'Voir les demandes concernant',
        },
        partners: {
          title: 'Associations et services actifs\n sur Entourage',
        },
        categories: {
          title: 'Catégories',
        },
        disableFilters: 'Désactiver filtres',
      },
      actions: {
        share: 'Partager',
        edit: 'Modifier',
        close: 'Clôturer',
        report: 'Signaler',
        reopen: 'Rouvrir',
        hasBeenClosed: 'Cette action solidaire a été clôturée.',
        participants: 'Participants',
        contribution: 'Contribution',
        ask_for_help: 'Demande',
        online: 'En ligne',
        by: 'par',
        createAt: 'Crée il y a',
        activeAt: 'actif il y a',
        shareTitles: {
          help: 'Aidez',
          realize: 'à réaliser',
          their: 'leur',
          his: 'son',
          action: 'action solidaire',
          comeToHelp: 'Venez en aide à',
          participate: 'Venez participer à l\'événement de',
        },
      },
      pois: {
        directions: 'Itinéraire',
        hours: 'Horaires',
        audience: 'Public',
        languages: 'Langues',
        contact: 'Contact',
        shareDescription: 'Retrouvez toutes les informations sur cette structure sur la carte des lieux solidaires de notre application !',
      },
    },
    navActions: {
      mapButton: 'Carte',
      returnButton: 'Retour',
      refresh: 'Rechercher dans cette zone',
    },
    profilModal: {
      modalTitle: 'Mon profil',
      STEP_1: '',
      step1: '1. Pour commencer, et si vous nous disiez qui vous êtes ?',
      step2: '2. Présentez-vous en quelques mots à la communauté',
      step3: '3. Autour de quel point géographique souhaitez-vous passer à l\'action ?',
      step4: '4. Nous avons besoin de votre email afin de pouvoir vous contacter',
      step5: '5. Pour finir, téléchargez une photo de vous afin de mettre un visage sur vos actions',
      firstNameLabel: 'Votre prénom',
      lastNameLabel: 'Votre nom (ne sera pas affiché)',
      locationLabel: 'Entrez un adresse, un lieu, une ville...',
      emailLabel: 'Votre email',
    },
    modalCharter: {
      title: 'Je respecte la charte d\'Entourage',
      validateLabel: 'J\'ai lu et j\'accepte',
      step1: {
        title: 'Recueillir l\'accord',
        content: 'Je dois recueillir le consentement des personnes concernées avant de créer un entourage',
      },
      step2: {
        title: 'Sécurité',
        content: 'Je n\'inclus aucun donnée permettant d\'identifier ou de localiser les personnes concernées',
      },
      step3: {
        title: 'Géolocalisation',
        content: 'La position précise des actions ne sera pas diffusée: elle est remplacée par les zones orange sur la carte',
      },
    },
    modalSensitization: {
      title: 'Bienvenue sur le réseau Entourage !',
      quote: {
        content: 'Avant, j’avais peur, j’étais mal à l’aise. Aujourd’hui j’ai changé mon regard, j’ai arrêté d’esquiver. Je parle aux personnes SDF comme à n’importe quel voisin, ça fait du bien',
        author: 'Théo',
      },
      content: 'Participez à un atelier de sensibilisation en ligne et apprenez comment aider les personnes en situation de précarité. Découvrez des moyens concrets d\'agir et des conseils pour entrer en relation avec les personnes que vous croisez !',
      participate: 'Je m\'inscris',
      dismiss: 'Non merci',
      send: 'Envoyer',
      close: 'Fermer',
      error: 'Veuillez renseigner une raison',
      reason: 'Je ne suis pas intéressé car ...',
      dismissReasons: {
        alreadyParticipated: 'J’ai déja participé à l’atelier en ligne',
        notInterested: 'Je ne suis pas intéressé par l’atelier',
        wantToDiscover: 'Je veux juste découvrir le site Entourage',
      },
    },
    modalEditAction: {
      titleCreate: 'Vous souhaitez créer une action solidaire ? C\'est parti !',
      titleUpdate: 'Mise à jour de votre action',
      step1: '1. Choisissez une catégorie et précisez une zone géographique',
      step2: '2. Donnez un titre clair à votre initiative',
      step3: '3. Racontez simplement votre histoire. Les actions avec une description claire attirent plus de membres et ont plus de chances d\'aboutir :',
      fieldLabelCategory: 'Catégorie',
      fieldLabelAddress: 'Adresse',
      fieldLabelTitle: 'Je suis disponible pour... / Je recherche...',
      fieldLabelDescription: 'Description',
      fieldCategoryHelpLabel: 'Je recherche...',
      fieldCategoryContributionLabel: 'Je me propose de...',
      validateLabelCreate: 'Créer mon action',
      validateLabelUpdate: 'Mettre à jour mon action',
    },
    modalEditEvent: {
      title: 'Vous souhaitez créer un événement solidaire ? C\'est parti !',
      step1: '1. Donnez un titre à votre événement',
      step2: '2. Où se déroulera-t-il ?',
      step3: '3. Indiquez la date et l\'heure de début',
      step4: '4. Indiquez la date et l\'heure de fin',
      step5: '5. Quel est le but de cet événement ?',
      fieldTitlePlaceholder: 'Ex: Apéro entre voisins',
      fieldAddressPlaceholder: 'Adresse précise',
      fieldLabelDate: 'date',
      fieldLabelTime: 'heure',
      fieldDescriptionPlaceholder: 'Je crée cet événement pour...',
      validateLabelCreate: 'Créer mon événement',
      validateLabelUpdate: 'Mettre à jour mon événement',
    },
    modalCloseAction: {
      subtitle: 'Je clôture mon action solidaire',
      body: "Comment s'est-elle déroulée ?",
      success: "C'est un succès",
      fail: "Ça n'a pas marché",
    },
    modalLogin: {
      title: 'Connexion / Inscription',
      askAccountCreation: "Vous n'avez pas encore de compte. Voulez-vous en créer un avec ce numero ?",
      buttonLabels: {
        createAccount: 'Créer un compte',
        login: 'Connexion',
        validateNumber: 'Valider le numéro',
        validateSMSCode: 'Valider le code SMS',
        validatePassword: 'Valider le mot de passe',
      },
      fieldLabels: {
        phone: 'Téléphone',
        enterYourPassword: 'Entre votre mot de passe (au moins 8 caractères)',
        SMSCode: "Entrez le code d'activation reçu",
        passwordForgotten: 'Mot de passe oublié ?',
        resendActivationCode: "Renvoyer le code d'activation",
        chooseYourPassword: 'Choisissez votre mot de passe',
        confirmYourPassword: 'Confirmez votre mot de passe',
      },
    },
  },
}

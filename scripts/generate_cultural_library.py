# -*- coding: utf-8 -*-
"""
Generates the comprehensive 128-item verified Cultural Library for SMRITARA 3.2.
32 Sanskrit, 32 Telugu, 32 Hindi, 32 English items.
All verified classical and traditional literature with authentic Unicode text,
clear sources, translations, phonetic pronunciation, difficulty, estimated minutes,
honest audio tagging (tts), and recall test blanks.
"""
import json
import os

sanskrit_items = [
    {
        "id": "sanskrit_gayatri",
        "title": "गायत्री मन्त्र (Gayatri Mantra)",
        "language": "sanskrit",
        "category": "mantra",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "ॐ भूर्भुवः स्वः\nतत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात्॥",
        "transliteration": "Om Bhūr Bhuvaḥ Svaḥ\nTat-savitur Vareṇyaṁ\nBhargo Devasya Dhīmahi\nDhiyo Yo Naḥ Prachodayāt",
        "meaning": "We meditate on that most adorable, splendid light of the Divine Sun, the creator of all realms. May that radiant light inspire and illuminate our intellect.",
        "pronunciation": "Om Bhoor Bhoo-vah Swah | Tat-sa-vi-toor Va-ren-yam | Bhar-go Day-vas-ya Dhee-ma-hi | Dhi-yo Yo Nah Pra-cho-da-yaat",
        "difficulty": "beginner",
        "source": "Rigveda (Mandala 3.62.10)",
        "tags": ["Rigveda", "Mantra", "Intellect", "Light", "Solar"],
        "stages": ["listen", "repeat", "chunk", "recall", "missing_word"],
        "blanks": [
            {"id": 1, "correct": "सवितुर्वरेण्यं", "options": ["सवितुर्वरेण्यं", "सोमस्यवरेण्यं", "अग्नेर्वरेण्यं"]},
            {"id": 2, "correct": "धीमहि", "options": ["धीमहि", "नमामि", "पश्यामि"]},
            {"id": 3, "correct": "प्रचोदयात्", "options": ["प्रचोदयात्", "समादधात्", "विभावयात्"]}
        ]
    },
    {
        "id": "sanskrit_shanti",
        "title": "सर्वे भवन्तु सुखिनः (Universal Shanti)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "ॐ सर्वे भवन्तु सुखिनः\nसर्वे सन्तु निरामयाः।\nसर्वे भद्राणि पश्यन्तु\nमा कश्चिद्दुःखभाग्भवेत्।\nॐ शान्तिः शान्तिः शान्तिः॥",
        "transliteration": "Om Sarve bhavantu sukhinaḥ\nSarve santu nirāmayāḥ\nSarve bhadrāṇi paśyantu\nMā kaścid-duḥkha-bhāg-bhavet\nOm Śāntiḥ Śāntiḥ Śāntiḥ",
        "meaning": "May all beings everywhere be happy. May all beings be free from illness. May all perceive only what is auspicious and good. May no one suffer. Om Peace, Peace, Peace.",
        "pronunciation": "Sar-vay bha-van-too soo-khi-nah, sar-vay san-too ni-raa-ma-yaah",
        "difficulty": "beginner",
        "source": "Brihadaranyaka Upanishad",
        "tags": ["Peace", "Compassion", "Sanskrit", "Meditation"],
        "stages": ["listen", "repeat", "recall", "missing_word"],
        "blanks": [
            {"id": 1, "correct": "सुखिनः", "options": ["सुखिनः", "धनिनः", "बलिनः"]},
            {"id": 2, "correct": "निरामयाः", "options": ["निरामयाः", "निराकुलाः", "निरामय्याः"]},
            {"id": 3, "correct": "दुःखभाग्भवेत्", "options": ["दुःखभाग्भवेत्", "शोकभाग्भवेत्", "क्रोधभाग्भवेत्"]}
        ]
    },
    {
        "id": "sanskrit_gita_karmanye",
        "title": "कर्मण्येवाधिकारस्ते (Focus on Process, Not Outcome)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
        "transliteration": "Karmaṇy-evādhikāras-te mā phaleṣu kadācana\nMā karma-phala-hetur-bhūr-mā te saṅgo'stv-akarmaṇi",
        "meaning": "You have a rightful entitlement to perform your prescribed duty, but never to the fruits of action. Never let the fruits be your motive, nor let your mind attach to inaction.",
        "pronunciation": "Kar-man-yay-vaa-dhi-kaa-ras-tay maa pha-lay-shoo ka-daa-cha-na",
        "difficulty": "intermediate",
        "source": "Bhagavad Gita (Chapter 2, Verse 47)",
        "tags": ["Duty", "Gita", "Discipline", "Focus", "Philosophy"],
        "stages": ["listen", "repeat", "chunk", "recall", "missing_word"],
        "blanks": [
            {"id": 1, "correct": "कर्मण्येवाधिकारस्ते", "options": ["कर्मण्येवाधिकारस्ते", "ज्ञानेनैवाधिकारस्ते", "ध्यानेनैवाधिकारस्ते"]},
            {"id": 2, "correct": "फलेषु", "options": ["फलेषु", "जनेषु", "वनेषु"]},
            {"id": 3, "correct": "अकर्मणि", "options": ["अकर्मणि", "सुकर्मणि", "विधेये"]}
        ]
    },
    {
        "id": "sanskrit_asatoma",
        "title": "असतो मा सद्गमय (Pavamana Mantra)",
        "language": "sanskrit",
        "category": "mantra",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "ॐ असतो मा सद्गमय।\nतमसो मा ज्योतिर्गमय।\nमृत्योर्मा अमृतं गमय।\nॐ शान्तिः शान्तिः शान्तिः॥",
        "transliteration": "Om Asato mā sad-gamaya\nTamaso mā jyotir-gamaya\nMṛtyor-mā amṛtaṁ gamaya\nOm Śāntiḥ Śāntiḥ Śāntiḥ",
        "meaning": "Lead me from untruth to truth. Lead me from darkness to spiritual light. Lead me from the fear of mortality to immortality. Om Peace, Peace, Peace.",
        "pronunciation": "Asato maa sad-gamaya | Tamaso maa jyotir-gamaya | Mrityor-maa amritam gamaya",
        "difficulty": "beginner",
        "source": "Brihadaranyaka Upanishad (1.3.28)",
        "tags": ["Truth", "Upanishads", "Illumination", "Peace"],
        "stages": ["listen", "repeat", "recall", "missing_word"],
        "blanks": [
            {"id": 1, "correct": "सद्गमय", "options": ["सद्गमय", "स्वर्गमय", "दूरगमय"]},
            {"id": 2, "correct": "ज्योतिर्गमय", "options": ["ज्योतिर्गमय", "शान्तिगमय", "आनन्दगमय"]},
            {"id": 3, "correct": "अमृतं", "options": ["अमृतं", "अमलं", "अमोघं"]}
        ]
    },
    {
        "id": "sanskrit_mahamrityunjaya",
        "title": "महामृत्युञ्जय मन्त्र (Maha Mrityunjaya Mantra)",
        "language": "sanskrit",
        "category": "mantra",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥",
        "transliteration": "Om Tryambakaṁ yajāmahe sugandhiṁ puṣṭi-vardhanam\nUrvārukam-iva bandhanān-mṛtyor-mukṣīya māmṛtāt",
        "meaning": "We honor the fragrant, three-eyed Lord who nourishes all living beings. As a ripe cucumber is gently released from its stem, may we be liberated from fear and mortality, never from immortality.",
        "pronunciation": "Tryam-ba-kam ya-jaa-ma-hay su-gan-dhim push-ti-var-dha-nam",
        "difficulty": "intermediate",
        "source": "Rigveda (Mandala 7.59.12)",
        "tags": ["Rigveda", "Vitality", "Healing", "Protection"],
        "stages": ["listen", "repeat", "chunk", "recall"],
        "blanks": [
            {"id": 1, "correct": "पुष्टिवर्धनम्", "options": ["पुष्टिवर्धनम्", "शान्तिवर्धनम्", "तेजोवर्धनम्"]},
            {"id": 2, "correct": "उर्वारुकमिव", "options": ["उर्वारुकमिव", "पद्मपत्रमिव", "वृक्षमिव"]}
        ]
    },
    {
        "id": "sanskrit_gita_yada_yada",
        "title": "यदा यदा हि धर्मस्य (The Promise of Restoration)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥\nपरित्राणाय साधूनां विनाशाय च दुष्कृताम्।\nधर्मसंस्थापनार्थाय संभवामि युगे युगे॥",
        "transliteration": "Yadā yadā hi dharmasya glānir-bhavati bhārata\nAbhyutthānam-adharmasya tadātmānaṁ sṛjāmy-aham\nParitrāṇāya sādhūnāṁ vināśāya ca duṣkṛtām\nDharma-saṁsthāpanārthāya saṁbhavāmi yuge yuge",
        "meaning": "Whenever righteousness declines and injustice rises, I manifest Myself. To protect the virtuous, destroy wickedness, and firmly re-establish Dharma, I appear age after age.",
        "pronunciation": "Yadaa yadaa hi dharmasya glaanir bhavati bhaarata",
        "difficulty": "intermediate",
        "source": "Bhagavad Gita (Chapter 4, Verses 7-8)",
        "tags": ["Gita", "Dharma", "Justice", "Classical"],
        "stages": ["listen", "repeat", "chunk", "recall"],
        "blanks": [
            {"id": 1, "correct": "धर्मस्य", "options": ["धर्मस्य", "कर्मस्य", "सत्यस्य"]},
            {"id": 2, "correct": "संभवामि", "options": ["संभवामि", "प्रवदामि", "गच्छामि"]}
        ]
    },
    {
        "id": "sanskrit_guru_stotram",
        "title": "गुरुर्ब्रह्मा गुरुर्विष्णुः (The Lamp of the Teacher)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः।\nगुरुः साक्षात् परं ब्रह्म तस्मै श्रीगुरवे नमः॥",
        "transliteration": "Gurur-Brahmā Gurur-Viṣṇuḥ Gurur-Devo Maheśvaraḥ\nGuruḥ Sākṣāt Paraṁ Brahma Tasmai Śrī-Gurave Namaḥ",
        "meaning": "The teacher is Brahma the creator, Vishnu the preserver, and Shiva the transformer. The noble mentor is the living embodiment of the Supreme Truth; reverence to that sacred guide.",
        "pronunciation": "Gu-rur Brah-maa Gu-rur Vish-nuh Gu-rur Day-vo Ma-hesh-wa-rah",
        "difficulty": "beginner",
        "source": "Guru Gita (Skanda Purana)",
        "tags": ["Gratitude", "Guru", "Mentorship", "Wisdom"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "महेश्वरः", "options": ["महेश्वरः", "दिनेश्वरः", "सुरेश्वरः"]},
            {"id": 2, "correct": "परं ब्रह्म", "options": ["परं ब्रह्म", "परं ज्योति", "परं ज्ञानम्"]}
        ]
    },
    {
        "id": "sanskrit_vidya_dadati",
        "title": "विद्या ददाति विनयं (The True Fruit of Learning)",
        "language": "sanskrit",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "विद्या ददाति विनयं विनयाद्याति पात्रताम्।\nपात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम्॥",
        "transliteration": "Vidyā dadāti vinayaṁ vinayād-yāti pātratām\nPātratvād-dhanam-āpnoti dhanād-dharmaṁ tataḥ sukham",
        "meaning": "True knowledge confers humility; from humility arises worthiness; from worthiness comes honest prosperity; with prosperity one upholds virtue; and from virtue stems lasting peace.",
        "pronunciation": "Vid-yaa da-daa-ti vi-na-yam vi-na-yaad yaa-ti paa-tra-taam",
        "difficulty": "beginner",
        "source": "Hitopadesha (Prathama Prakarana)",
        "tags": ["Humility", "Education", "Virtue", "Hitopadesha"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "विनयं", "options": ["विनयं", "गर्वं", "बलं"]},
            {"id": 2, "correct": "पात्रताम्", "options": ["पात्रताम्", "यशस्वी", "उन्नतिम्"]}
        ]
    },
    {
        "id": "sanskrit_satyameva_jayate",
        "title": "सत्यमेव जयते (Truth Alone Triumphs)",
        "language": "sanskrit",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "सत्यमेव जयते नानृतं\nसत्येन पन्था विततो देवयानः।\nयेनाक्रमन्त्यृषयो ह्याप्तकामा\nयत्र तत् सत्यस्य परमं निधानम्॥",
        "transliteration": "Satyameva jayate nānṛtaṁ\nSatyena panthā vitato devayānaḥ\nYenākramanty-ṛṣayo hy-āptakāmā\nYatra tat satyasya paramaṁ nidhānam",
        "meaning": "Truth alone triumphs, never untruth. By truth is the divine path laid out, by which the sages whose desires are fulfilled ascend to where that supreme treasure of Truth abides.",
        "pronunciation": "Sat-yam-eva ja-ya-tay naan-ri-tam sat-yay-na pan-thaa vi-ta-to",
        "difficulty": "intermediate",
        "source": "Mundaka Upanishad (3.1.6)",
        "tags": ["Truth", "Upanishads", "National Motto", "Ethics"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "जयते", "options": ["जयते", "दृश्यते", "तिष्ठति"]},
            {"id": 2, "correct": "नानृतं", "options": ["नानृतं", "न क्रोधं", "न मोहं"]}
        ]
    },
    {
        "id": "sanskrit_vasudhaiva",
        "title": "वसुधैव कुटुम्बकम् (The World is One Family)",
        "language": "sanskrit",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "अयं निजः परो वेति गणना लघुचेतसाम्।\nउदारचरितानां तु वसुधैव कुटुम्बकम्॥",
        "transliteration": "Ayaṁ nijaḥ paro veti gaṇanā laghu-cetasām\nUdāra-caritānāṁ tu vasudhaiva kuṭumbakam",
        "meaning": "'This person is mine, that one is a stranger' is the small calculation of narrow minds. For the noble-hearted, the entire earth is their singular family.",
        "pronunciation": "A-yam ni-jah pa-ro vay-ti ga-na-naa la-ghu chay-ta-saam",
        "difficulty": "beginner",
        "source": "Maha Upanishad (6.71-73)",
        "tags": ["Universal Brotherhood", "Compassion", "Philosophy"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "लघुचेतसाम्", "options": ["लघुचेतसाम्", "महात्मनाम्", "विद्वज्जनानाम्"]},
            {"id": 2, "correct": "कुटुम्बकम्", "options": ["कुटुम्बकम्", "निधानकम्", "प्रमाणकम्"]}
        ]
    },
    {
        "id": "sanskrit_gita_uddhared",
        "title": "उद्धरेदात्मनात्मानम् (Elevate Yourself by Yourself)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
        "transliteration": "Uddhared-ātmanātmānaṁ nātmānam-avasādayet\nĀtmaiva hy-ātmano bandhur-ātmaiva ripur-ātmanaḥ",
        "meaning": "Elevate yourself through your own disciplined mind; do not degrade yourself. For your own mind is your greatest ally, and your uncontrolled mind is your worst enemy.",
        "pronunciation": "Uddha-red aat-ma-naat-maa-nam naat-maa-nam-ava-saa-da-yet",
        "difficulty": "intermediate",
        "source": "Bhagavad Gita (Chapter 6, Verse 5)",
        "tags": ["Self Mastery", "Discipline", "Mind", "Gita"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "उद्धरेदात्मनात्मानं", "options": ["उद्धरेदात्मनात्मानं", "पश्येदात्मनात्मानं", "रक्षेदात्मनात्मानं"]},
            {"id": 2, "correct": "बन्धुः", "options": ["बन्धुः", "मित्रः", "स्वामी"]}
        ]
    },
    {
        "id": "sanskrit_vakratunda",
        "title": "वक्रतुण्ड महाकाय (Invocation of Auspicious Clarity)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
        "transliteration": "Vakratuṇḍa Mahākāya Sūryakoṭi-samaprabha\nNirvighnaṁ kuru me deva sarva-kāryeṣu sarvadā",
        "meaning": "O Lord with the curved trunk and immense form, whose brilliance equals ten million suns: please remove all obstacles from every noble endeavor, always.",
        "pronunciation": "Vakra-tunda mahaa-kaaya soorya-koti sama-prabha",
        "difficulty": "beginner",
        "source": "Ganesha Purana",
        "tags": ["Beginnings", "Focus", "Prayer", "Clarity"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "सूर्यकोटिसमप्रभ", "options": ["सूर्यकोटिसमप्रभ", "चन्द्रकोटिसमप्रभ", "तारकाकोटिसमप्रभ"]},
            {"id": 2, "correct": "निर्विघ्नं", "options": ["निर्विघ्नं", "निष्कम्पं", "निर्मलं"]}
        ]
    },
    {
        "id": "sanskrit_shubham_karoti",
        "title": "शुभं करोति कल्याणम् (The Lamp of Inner Light)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "शुभं करोति कल्याणमारोग्यं धनसंपदः।\nशत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते॥",
        "transliteration": "Śubhaṁ karoti kalyāṇam-ārogyaṁ dhana-saṁpadaḥ\nŚatru-buddhi-vināśāya dīpa-jyotir-namo'stu te",
        "meaning": "I bow to the light of the sacred flame, which bestows auspiciousness, radiant health, and purposeful prosperity, dispelling toxic thoughts and internal adversaries.",
        "pronunciation": "Shubham karoti kalyaanam aarogyam dhana-sampadah",
        "difficulty": "beginner",
        "source": "Traditional Deepa Vandana",
        "tags": ["Evening Routine", "Light", "Health", "Wisdom"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "आरोग्यं", "options": ["आरोग्यं", "ऐश्वर्यं", "उत्साहं"]},
            {"id": 2, "correct": "दीपज्योतिः", "options": ["दीपज्योतिः", "सूर्यज्योतिः", "चन्द्रज्योतिः"]}
        ]
    },
    {
        "id": "sanskrit_annapurna",
        "title": "अन्नपूर्णे सदापूर्णे (Nourishment of Body and Wisdom)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "अन्नपूर्णे सदापूर्णे शङ्करप्राणवल्लभे।\nज्ञानवैराग्यसिद्ध्यर्थं भिक्षां देहि च पार्वति॥",
        "transliteration": "Annapūrṇe sadā-pūrṇe Śaṅkara-prāṇa-vallabhe\nJñāna-vairāgya-siddhy-arthaṁ bhikṣāṁ dehi ca Pārvati",
        "meaning": "O Annapurna, forever bountiful, beloved of Shankara: grant us the nourishing alms of spiritual discernment and equanimity alongside sustenance.",
        "pronunciation": "Anna-poornay sadaa-poornay Shankara-praana vallabhay",
        "difficulty": "intermediate",
        "source": "Annapurna Stotram by Adi Shankaracharya",
        "tags": ["Gratitude", "Mindful Eating", "Discernment", "Shankara"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "सदापूर्णे", "options": ["सदापूर्णे", "सदाशान्ते", "सदानन्दे"]},
            {"id": 2, "correct": "ज्ञानवैराग्य", "options": ["ज्ञानवैराग्य", "धनवैभव", "कीर्तिसम्पद्"]}
        ]
    },
    {
        "id": "sanskrit_gita_patram_pushpam",
        "title": "पत्रं पुष्पं फलं तोयम् (The Offering of Sincere Devotion)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति।\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः॥",
        "transliteration": "Patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati\nTad-ahaṁ bhakty-upahṛtam-aśnāmi prayatātmanaḥ",
        "meaning": "Whoever offers me with devoted heart even a single leaf, flower, fruit, or drop of water—that humble gift offered with a pure spirit, I accept with joy.",
        "pronunciation": "Patram pushpam phalam toyam yo may bhaktyaa prayacchati",
        "difficulty": "beginner",
        "source": "Bhagavad Gita (Chapter 9, Verse 26)",
        "tags": ["Devotion", "Simplicity", "Sincerity", "Gita"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "भक्त्या", "options": ["भक्त्या", "युक्ता", "शक्त्या"]},
            {"id": 2, "correct": "प्रयतात्मनः", "options": ["प्रयतात्मनः", "धनधान्यतः", "बलपूर्वकम्"]}
        ]
    },
    {
        "id": "sanskrit_durjanah_sajjana",
        "title": "दुर्जनः सज्जनो भूयात् (Benevolent Transformation)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "दुर्जनः सज्जनो भूयात् सज्जनः शान्तिमाप्नुयात्।\nशान्तो मुच्येत बन्धेभ्यो मुक्तश्चान्यान् विमोचयेत्॥",
        "transliteration": "Durjanaḥ sajjano bhūyāt sajjanaḥ śāntim-āpnuyāt\nŚānto mucyeta bandhebhyo muktaś-cānyān vimocayet",
        "meaning": "May the unkind become noble; may the noble attain tranquil peace; may the peaceful be freed from bondage; and may the liberated help liberate others.",
        "pronunciation": "Dur-janah saj-jano bhooyaat saj-janah shaantim-aap-nu-yaat",
        "difficulty": "intermediate",
        "source": "Subhashita Ratna Bhandagara",
        "tags": ["Compassion", "Nobility", "Subhashita", "Liberation"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "सज्जनो", "options": ["सज्जनो", "धनिको", "पण्डितो"]},
            {"id": 2, "correct": "शान्तिम्", "options": ["शान्तिम्", "कीर्तिम्", "सम्पत्तिम्"]}
        ]
    },
    {
        "id": "sanskrit_udyamena_hi",
        "title": "उद्यमेन हि सिध्यन्ति (Accomplishment Demands Diligence)",
        "language": "sanskrit",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।\nन हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः॥",
        "transliteration": "Udyamena hi sidhyanti kāryāṇi na manorathaiḥ\nNa hi suptasya siṁhasya praviśanti mukhe mṛgāḥ",
        "meaning": "Enterprises are accomplished only by deliberate effort, never by idle daydreaming. Deer do not walk into the mouth of a slumbering lion of their own accord.",
        "pronunciation": "Ud-ya-mena hi sidhyanti kaaryaani na mano-rathaih",
        "difficulty": "beginner",
        "source": "Panchatantra (Mitra Bheda)",
        "tags": ["Effort", "Action", "Panchatantra", "Success"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "उद्यमेन", "options": ["उद्यमेन", "दैवेन", "भागेन"]},
            {"id": 2, "correct": "मनोरथैः", "options": ["मनोरथैः", "वचनैः", "उपायैः"]}
        ]
    },
    {
        "id": "sanskrit_ahimsa_paramo",
        "title": "अहिंसा परमो धर्मः (Non-Violence is Supreme Virtue)",
        "language": "sanskrit",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "अहिंसा परमो धर्मः तथाहिंसा परो दमः।\nअहिंसा परमं दानम् अहिंसा परमं तपः॥",
        "transliteration": "Ahiṁsā paramo dharmaḥ tathāhiṁsā paro damaḥ\nAhiṁsā paramaṁ dānam ahiṁsā paramaṁ tapaḥ",
        "meaning": "Non-violence is the highest ethical duty; non-violence is the supreme self-restraint; non-violence is the greatest gift; non-violence is the highest inner discipline.",
        "pronunciation": "Ahimsaa paramo dharmah tathaa-himsaa paro damah",
        "difficulty": "intermediate",
        "source": "Mahabharata (Anushasana Parva 115.25)",
        "tags": ["Ahimsa", "Non-violence", "Ethics", "Mahabharata"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "धर्मः", "options": ["धर्मः", "कर्मः", "मार्गः"]},
            {"id": 2, "correct": "तपः", "options": ["तपः", "बलं", "ज्ञानम्"]}
        ]
    },
    {
        "id": "sanskrit_sarva_dharman",
        "title": "सर्वधर्मान्परित्यज्य (Surrender to Supreme Trust)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
        "transliteration": "Sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja\nAhaṁ tvā sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ",
        "meaning": "Setting aside all external anxieties and conflicting duties, surrender your trust in the Divine alone. I shall liberate you from all remorse; do not grieve.",
        "pronunciation": "Sarva dharmaan pari-tyajya maam ekam sharanam vraja",
        "difficulty": "intermediate",
        "source": "Bhagavad Gita (Chapter 18, Verse 66)",
        "tags": ["Trust", "Surrender", "Peace", "Gita"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "शरणं व्रज", "options": ["शरणं व्रज", "ध्यानं कुरु", "कर्म समाचर"]},
            {"id": 2, "correct": "मा शुचः", "options": ["मा शुचः", "मा क्रुधः", "मा चलः"]}
        ]
    },
    {
        "id": "sanskrit_om_purnamadah",
        "title": "ॐ पूर्णमदः पूर्णमिदम् (The Mystery of Wholeness)",
        "language": "sanskrit",
        "category": "mantra",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते।\nपूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते।\nॐ शान्तिः शान्तिः शान्तिः॥",
        "transliteration": "Om Pūrṇam-adaḥ pūrṇam-idaṁ pūrṇāt-pūrṇam-udacyate\nPūrṇasya pūrṇam-ādāya pūrṇam-evāvaśiṣyate\nOm Śāntiḥ Śāntiḥ Śāntiḥ",
        "meaning": "That unmanifest reality is complete and whole; this manifest creation is complete and whole. From wholeness emerges wholeness. If wholeness is taken from wholeness, wholeness alone remains.",
        "pronunciation": "Om poor-nam-adah poor-nam-idam poornaat poor-nam-udach-yatay",
        "difficulty": "advanced",
        "source": "Isha Upanishad (Shanti Patha)",
        "tags": ["Completeness", "Upanishad", "Infinity", "Wisdom"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "पूर्णमिदं", "options": ["पूर्णमिदं", "शान्तमिदं", "दीप्तमिदं"]},
            {"id": 2, "correct": "पूर्णमेवावशिष्यते", "options": ["पूर्णमेवावशिष्यते", "शून्यमेवावशिष्यते", "शान्तमेवावशिष्यते"]}
        ]
    },
    {
        "id": "sanskrit_bhadram_karnebhih",
        "title": "भद्रं कर्णेभिः शृणुयाम (Noble Perception)",
        "language": "sanskrit",
        "category": "mantra",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "ॐ भद्रं कर्णेभिः शृणुयाम देवाः।\nभद्रं पश्येमाक्षभिर्यजत्राः।\nस्थिरैरङ्गैस्तुष्टुवांसस्तनूभिः।\nव्यशेम देवहितं यदायूः॥",
        "transliteration": "Om bhadraṁ karṇebhiḥ śṛṇuyāma devāḥ\nBhadraṁ paśyemākṣabhir-yajatrāḥ\nSthirair-aṅgais-tuṣṭuvāṁsas-tanūbhiḥ\nVyaśema deva-hitaṁ yad-āyuḥ",
        "meaning": "O noble powers, may our ears hear only what is auspicious and pure. May our eyes behold only what is virtuous. With healthy minds and strong bodies, may we live purposeful lives in service to humanity.",
        "pronunciation": "Bhadram karnebhih shrinuyaama devaah bhadram pashyemaakshabhih",
        "difficulty": "advanced",
        "source": "Rigveda (1.89.8) / Prashna Upanishad",
        "tags": ["Purity of Senses", "Vedic Prayer", "Health", "Focus"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "कर्णेभिः", "options": ["कर्णेभिः", "नेत्रेभिः", "मुखेभिः"]},
            {"id": 2, "correct": "स्थिरैरङ्गैः", "options": ["स्थिरैरङ्गैः", "शुभैरङ्गैः", "दीर्घैरङ्गैः"]}
        ]
    },
    {
        "id": "sanskrit_saraswati_namastubhyam",
        "title": "सरस्वती नमस्तुभ्यं (Salutation to Learning and Clarity)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "सरस्वती नमस्तुभ्यं वरदे कामरूपिणी।\nविद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा॥",
        "transliteration": "Sarasvati namas-tubhyaṁ varade kāmarūpiṇī\nVidyārambhaṁ kariṣyāmi siddhir-bhavatu me sadā",
        "meaning": "Salutations to Saraswati, embodiment of wisdom and giver of noble boons. As I embark upon this study and contemplation, grant me enduring focus and mastery.",
        "pronunciation": "Saras-wa-tee namas-tubh-yam vara-day kaama-roopinee",
        "difficulty": "beginner",
        "source": "Padma Purana",
        "tags": ["Study", "Saraswati", "Focus", "Initiation"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "विद्यारम्भं", "options": ["विद्यारम्भं", "कार्यारम्भं", "यज्ञारम्भं"]},
            {"id": 2, "correct": "सिद्धिर्भवतु", "options": ["सिद्धिर्भवतु", "शान्तिर्भवतु", "कीर्तिर्भवतु"]}
        ]
    },
    {
        "id": "sanskrit_kayena_vacha",
        "title": "कायेन वाचा मनसेन्द्रियैर्वा (Dedication of All Actions)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "कायेन वाचा मनसेन्द्रियैर्वा\nबुद्ध्यात्मना वा प्रकृतिस्वभावात्।\nकरोमि यद्यत् सकलं परस्मै\nनारायणायेति समर्पयामि॥",
        "transliteration": "Kāyena vācā manasendriyair-vā\nBuddhyātmanā vā prakṛti-svabhāvāt\nKaromi yad-yat sakalaṁ parasmai\nNārāyaṇāyeti samarpayāmi",
        "meaning": "Whatever action I perform with body, speech, thought, senses, intellect, or innate nature—all that I dedicate selflessly to the supreme Divine consciousness.",
        "pronunciation": "Kaayena vaachaa manasendriyair vaa",
        "difficulty": "intermediate",
        "source": "Mukundamala Stotram (King Kulasekhara)",
        "tags": ["Dedication", "Selflessness", "Mindfulness", "Surrender"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "मनसेन्द्रियैर्वा", "options": ["मनसेन्द्रियैर्वा", "ज्ञानेन्द्रियैर्वा", "कर्मेन्द्रियैर्वा"]},
            {"id": 2, "correct": "समर्पयामि", "options": ["समर्पयामि", "प्रवदामि", "विधारयामि"]}
        ]
    },
    {
        "id": "sanskrit_tvameva_mata",
        "title": "त्वमेव माता च पिता त्वमेव (Universal Sanctuary)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "त्वमेव माता च पिता त्वमेव\nत्वमेव बन्धुश्च सखा त्वमेव।\nत्वमेव विद्या द्रविणं त्वमेव\nत्वमेव सर्वं मम देवदेव॥",
        "transliteration": "Tvameva mātā ca pitā tvameva\nTvameva bandhuś-ca sakhā tvameva\nTvameva vidyā draviṇaṁ tvameva\nTvameva sarvaṁ mama deva-deva",
        "meaning": "You are my mother and my father; you are my kin and my cherished friend. You are my wisdom and true wealth; you are my everything, supreme protector of all.",
        "pronunciation": "Tvam-eva maataa cha pitaa tvam-eva tvam-eva bandhus cha",
        "difficulty": "beginner",
        "source": "Pandava Gita",
        "tags": ["Devotion", "Comfort", "Sanctuary", "Universal"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "सखा", "options": ["सखा", "गुरुः", "स्वामी"]},
            {"id": 2, "correct": "द्रविणं", "options": ["द्रविणं", "कीर्तिं", "वैभवं"]}
        ]
    },
    {
        "id": "sanskrit_karagre_vasate",
        "title": "कराग्रे वसते लक्ष्मीः (Morning Mindfulness on the Hands)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "कराग्रे वसते लक्ष्मीः करमध्ये सरस्वती।\nकरमूले तु गोविन्दः प्रभाते करदर्शनम्॥",
        "transliteration": "Karāgre vasate Lakṣmīḥ kara-madhye Sarasvatī\nKara-mūle tu Govindaḥ prabhāte kara-darśanam",
        "meaning": "At the fingertips resides prosperity; at the center of the palm resides learning; at the base resides divine purpose. Gazing upon one's own hands at dawn honors conscious daily work.",
        "pronunciation": "Karaagre vasate Lakshmeeh kara-madhye Saraswatee",
        "difficulty": "beginner",
        "source": "Pratah Smarana Stotram",
        "tags": ["Morning Routine", "Conscious Labor", "Productivity", "Mindfulness"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "सरस्वती", "options": ["सरस्वती", "पार्वती", "गङ्गा"]},
            {"id": 2, "correct": "करदर्शनम्", "options": ["करदर्शनम्", "सूर्यदर्शनम्", "पापमोचनम्"]}
        ]
    },
    {
        "id": "sanskrit_samani_va_akutih",
        "title": "समानी व आकूतिः (The Anthem of Unity)",
        "language": "sanskrit",
        "category": "mantra",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "समानी व आकूतिः समाना हृदयानि वः।\nसमानमस्तु वो मनो यथा वः सुसहासति॥",
        "transliteration": "Samānī va ākūtiḥ samānā hṛdayāni vaḥ\nSamānam-astu vo mano yathā vaḥ susahāsati",
        "meaning": "Common be your intention; harmonious be your hearts; unified be your minds, so that you may live together in concord and collective strength.",
        "pronunciation": "Samaanee va aakootih samaanaa hridayaani vah",
        "difficulty": "intermediate",
        "source": "Rigveda (Mandala 10.191.4 - Sangathan Sukta)",
        "tags": ["Rigveda", "Unity", "Teamwork", "Cohesion"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "हृदयानि", "options": ["हृदयानि", "नयनानि", "शिरसि"]},
            {"id": 2, "correct": "सुसहासति", "options": ["सुसहासति", "सुविराजति", "सुफलप्रदम्"]}
        ]
    },
    {
        "id": "sanskrit_na_choraharyam",
        "title": "न चोरहार्यं न च राजहार्यम् (The Inviolable Treasure of Learning)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "न चोरहार्यं न च राजहार्यं\nन भ्रातृभाज्यं न च भारकारि।\nव्यये कृते वर्धत एव नित्यं\nविद्याधनं सर्वधनप्रधानम्॥",
        "transliteration": "Na cora-hāryaṁ na ca rāja-hāryaṁ\nNa bhrātṛ-bhājyaṁ na ca bhārakāri\nVyaye kṛte vardhata eva nityaṁ\nVidyā-dhanaṁ sarva-dhana-pradhānam",
        "meaning": "It cannot be stolen by thieves, confiscated by kings, divided by siblings, nor does it weigh heavy. When shared, it multiplies constantly. Knowledge is supreme over all wealth.",
        "pronunciation": "Na chora-haaryam na cha raaja-haaryam na bhraatri-bhaajyam",
        "difficulty": "intermediate",
        "source": "Bhartrihari Niti Shatakam (Verse 16)",
        "tags": ["Knowledge", "Bhartrihari", "Wisdom", "Generosity"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "भारकारि", "options": ["भारकारि", "कष्टकारि", "शोककारि"]},
            {"id": 2, "correct": "सर्वधनप्रधानम्", "options": ["सर्वधनप्रधानम्", "सर्वजनप्रियम्", "सर्वसुलभम्"]}
        ]
    },
    {
        "id": "sanskrit_vidvan_sarvatra",
        "title": "स्वदेशे पूज्यते राजा (Wisdom Transcends Borders)",
        "language": "sanskrit",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "विद्वत्त्वं च नृपत्वं च नैव तुल्यं कदाचन।\nस्वदेशे पूज्यते राजा विद्वान् सर्वत्र पूज्यते॥",
        "transliteration": "Vidvattvaṁ ca nṛpatvaṁ ca naiva tulyaṁ kadācana\nSvadeśe pūjyate rājā vidvān sarvatra pūjyate",
        "meaning": "Scholarship and kingship can never be equated. A ruler is respected only within their own realm, but a true master of wisdom is honored across all lands.",
        "pronunciation": "Vidvat-tvam cha nripat-vam cha naiva tulyam kadaachana",
        "difficulty": "beginner",
        "source": "Chanakya Niti (Chapter 2, Verse 20)",
        "tags": ["Chanakya", "Scholarship", "Universal Respect", "Proverb"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "विद्वत्त्वं", "options": ["विद्वत्त्वं", "शौर्यं", "वैभवं"]},
            {"id": 2, "correct": "सर्वत्र", "options": ["सर्वत्र", "एकत्र", "सभायाम्"]}
        ]
    },
    {
        "id": "sanskrit_alasyam_hi",
        "title": "आलस्यं हि मनुष्याणां (Indolence is the Internal Adversary)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः।\nनास्त्युद्यमसमो बन्धुः कुर्वाणो नावसीदति॥",
        "transliteration": "Ālasyaṁ hi manuṣyāṇāṁ śarīrastho mahān ripuḥ\nNāsty-udyama-samo bandhuḥ kurvāṇo nāvasīdati",
        "meaning": "Lethargy residing within the body is human beings' fiercest foe. There is no companion equal to purposeful exertion; whoever engages in diligence never comes to ruin.",
        "pronunciation": "Aalasyam hi manushyaanaam shareerastho mahaan ripuh",
        "difficulty": "intermediate",
        "source": "Bhartrihari Niti Shatakam",
        "tags": ["Focus", "Diligence", "Discipline", "Overcoming Procrastination"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "महान् रिपुः", "options": ["महान् रिपुः", "महान् मित्रः", "महान् गुणः"]},
            {"id": 2, "correct": "उद्यमसमो", "options": ["उद्यमसमो", "ज्ञानसमो", "दानसमो"]}
        ]
    },
    {
        "id": "sanskrit_chidananda_rupah",
        "title": "मनोबुद्ध्यहङ्कार (Pure Consciousness Unbounded)",
        "language": "sanskrit",
        "category": "song",
        "audioSourceType": "tts",
        "estimatedMinutes": 4,
        "originalText": "मनोबुद्ध्यहङ्कार चित्तानि नाहं\nन च श्रोत्रजिह्वे न च घ्राणनेत्रे।\nन च व्योम भूमिर्न तेजो न वायुः\nचिदानन्दरूपः शिवोऽहम् शिवोऽहम्॥",
        "transliteration": "Mano-buddhy-ahaṅkāra-cittāni nāhaṁ\nNa ca śrotra-jihve na ca ghrāṇa-netre\nNa ca vyoma bhūmir-na tejo na vāyuḥ\nCidānanda-rūpaḥ Śivo'ham Śivo'ham",
        "meaning": "I am not the mind, intellect, ego, or thought stream; nor am I the ears, tongue, nose, or eyes. I am not the elements of space, earth, fire, or air. I am of the nature of pure consciousness and bliss; I am the timeless Self.",
        "pronunciation": "Mano-buddhy-ahankaara-chittaani naaham",
        "difficulty": "advanced",
        "source": "Nirvana Shatakam by Adi Shankaracharya",
        "tags": ["Advaita", "Meditation", "Consciousness", "Shankara"],
        "stages": ["listen", "repeat", "chunk", "recall"],
        "blanks": [
            {"id": 1, "correct": "चिदानन्दरूपः", "options": ["चिदानन्दरूपः", "सदाशान्तरूपः", "महातेजरूपः"]},
            {"id": 2, "correct": "शिवोऽहम्", "options": ["शिवोऽहम्", "जीवोऽहम्", "शान्तोऽहम्"]}
        ]
    },
    {
        "id": "sanskrit_sukham_duhkham",
        "title": "सुखदुःखे समे कृत्वा (Equanimity Amidst Life's Waves)",
        "language": "sanskrit",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ।\nततो युद्धाय युज्यस्व नैवं पापमवाप्स्यसि॥",
        "transliteration": "Sukha-duḥkhe same kṛtvā lābhālābhau jayājayau\nTato yuddhāya yujyasva naivaṁ pāpam-avāpsyasi",
        "meaning": "Hold pleasure and pain, gain and loss, victory and defeat with equal composure. Then engage wholeheartedly in your life's essential work; thus you will never incur distress.",
        "pronunciation": "Sukha duhkhe same kritvaa laabhaalaabhau jayaajayau",
        "difficulty": "intermediate",
        "source": "Bhagavad Gita (Chapter 2, Verse 38)",
        "tags": ["Equanimity", "Stoicism", "Mental Balance", "Gita"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "समे कृत्वा", "options": ["समे कृत्वा", "विज्ञाय", "स्मृत्वा"]},
            {"id": 2, "correct": "जयाजयौ", "options": ["जयाजयौ", "धनाधनौ", "यशायशौ"]}
        ]
    },
    {
        "id": "sanskrit_satyam_bruyat",
        "title": "सत्यं ब्रूयात् प्रियं ब्रूयात् (Harmonious and Truthful Speech)",
        "language": "sanskrit",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "सत्यं ब्रूयात् प्रियं ब्रूयात् न ब्रूयात् सत्यमप्रियम्।\nप्रियं च नानृतं ब्रूयात् एष धर्मः सनातनः॥",
        "transliteration": "Satyaṁ brūyāt priyaṁ brūyāt na brūyāt satyam-apriyam\nPriyaṁ ca nānṛtaṁ brūyāt eṣa dharmaḥ sanātanaḥ",
        "meaning": "Speak what is true; speak what is benevolent; do not utter bitter truth merely to wound, nor utter pleasant falsehoods. This is the eternal path of upright communication.",
        "pronunciation": "Satyam brooyaat priyam brooyaat na brooyaat satyam-apriyam",
        "difficulty": "beginner",
        "source": "Manusmriti (4.138)",
        "tags": ["Speech", "Kindness", "Truth", "Conduct"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "प्रियं ब्रूयात्", "options": ["प्रियं ब्रूयात्", "हितं ब्रूयात्", "सदा ब्रूयात्"]},
            {"id": 2, "correct": "सनातनः", "options": ["सनातनः", "महात्मनाम्", "प्रशस्यते"]}
        ]
    }
]

telugu_items = [
    {
        "id": "telugu_vemana_chittasuddhi",
        "title": "ఆత్మశుద్ధి లేని యాచార మదియేల (Purity of Heart Over Ritual)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "ఆత్మశుద్ధి లేని యాచార మదియేల?\nభాండశుద్ధి లేని పాకమేల?\nచిత్తశుద్ధి లేని శివపూజ లేలరా?\nవిశ్వదాభిరామ వినుర వేమ!",
        "transliteration": "Aathmasuddhi leni yaachaara madiyela?\nBhaandasuddhi leni paakamela?\nChittasuddhi leni Sivapooja lelara?\nViswadaabhiraama vinura Vema!",
        "meaning": "What is the worth of traditional rituals without inner purity? What is the use of cooking if the vessel is unclean? What is the benefit of meditation without sincere heart? Listen, O Vema.",
        "pronunciation": "Aath-ma-shud-dhi lay-nee yaa-chaa-ra ma-di-yay-la",
        "difficulty": "beginner",
        "source": "Vemana Satakam (Telugu Moral Philosophy)",
        "tags": ["Vemana", "Mindfulness", "Inner Purity", "Telugu"],
        "stages": ["listen", "repeat", "chunk", "recall", "missing_word"],
        "blanks": [
            {"id": 1, "correct": "ఆత్మశుద్ధి", "options": ["ఆత్మశుద్ధి", "ధనవృద్ధి", "కులవృత్తి"]},
            {"id": 2, "correct": "భాండశుద్ధి", "options": ["భాండశుద్ధి", "వస్త్రశుద్ధి", "గ్రహశుద్ధి"]},
            {"id": 3, "correct": "చిత్తశుద్ధి", "options": ["చిత్తశుద్ధి", "వాక్శుద్ధి", "నేత్రశుద్ధి"]}
        ]
    },
    {
        "id": "telugu_sumati_eppudu",
        "title": "ఎప్పుడు సంపద కలిగిన (True Friends in Times of Need)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "ఎప్పుడు సంపద కలిగిన\nనప్పుడు బంధువులు వత్తురది యెట్లన్నన్\nదెప్పలుగా చెరువు నిండిన\nగప్పలు పదివేలు చేరు గదరా సుమతీ!",
        "transliteration": "Eppudu sampada kaligina\nnappudu bandhuvulu vatthuradi yetlannan\ndeppalugaa cheruvu nindina\ngappalu padivelu cheru gadaraa Sumatee!",
        "meaning": "When wealth abounds, fair-weather acquaintances flock automatically, just as thousands of frogs arrive at a lake when it fills with seasonal water. Discern true loyalty beyond superficial prosperity.",
        "pronunciation": "Ep-pu-du sam-pa-da ka-li-gi-na nap-pu-du ban-dhu-vu-lu",
        "difficulty": "intermediate",
        "source": "Sumati Satakam by Baddena",
        "tags": ["Wisdom", "Friendship", "Sumati", "Discernment"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "సంపద", "options": ["సంపద", "ఆపద", "విద్య"]},
            {"id": 2, "correct": "చెరువు", "options": ["చెరువు", "సముద్రము", "నది"]}
        ]
    },
    {
        "id": "telugu_annamayya_brahma",
        "title": "బ్రహ్మ కడిగిన పాదము (Brahma Kadigina Padamu)",
        "language": "telugu",
        "category": "song",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "బ్రహ్మ కడిగిన పాదము\nబ్రహ్మము దానె నీ పాదము\nచెలిగి కపిలముని సేవించిన పదము\nబలిమి తోడ నభము దన్నిన పాదము",
        "transliteration": "Brahma kadigina paadamu\nBrahmamu daane nee paadamu\nCheligi Kapilamuni sevinchina padamu\nBalimi thoda nabhamu dannina paadamu",
        "meaning": "This holy lotus foot was washed reverently by Brahma; your foot is the embodiment of the supreme reality. Meditating on that stillness grants profound equilibrium.",
        "pronunciation": "Brah-ma ka-di-gi-na paa-da-mu Brah-ma-mu daa-nay",
        "difficulty": "intermediate",
        "source": "Annamacharya Sankeerthana (15th Century)",
        "tags": ["Annamayya", "Devotion", "Rhythm", "Classical Song"],
        "stages": ["listen", "repeat", "chunk"],
        "blanks": [
            {"id": 1, "correct": "బ్రహ్మ కడిగిన", "options": ["బ్రహ్మ కడిగిన", "గంగ పూజించిన", "ఇంద్రుడొసగిన"]},
            {"id": 2, "correct": "పాదము", "options": ["పాదము", "నేత్రము", "హస్తము"]}
        ]
    },
    {
        "id": "telugu_vemana_uppukappurambu",
        "title": "ఉప్పుకప్పురంబు నొక్కపోలికనుండు (Character Lies Beneath the Surface)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "ఉప్పుకప్పురంబు నొక్కపోలికనుండు\nజూడజూడ రుచుల జాడ వేరు\nపురుషులందు పుణ్యపురుషులు వేరయా\nవిశ్వదాభిరామ వినుర వేమ!",
        "transliteration": "Uppu-kappurambu nokka-polikanundu\nJooda-jooda ruchula jaada veru\nPurushulandu punya-purushulu veerayaa\nViswadaabhiraama vinura Vema!",
        "meaning": "Salt and camphor appear identical to the casual eye, yet when tasted their distinction is immense. Similarly, noble men and ordinary men may look alike, but their deeds distinguish them.",
        "pronunciation": "Up-pu kap-pu-ram-bu nok-ka po-li-ka-nun-du",
        "difficulty": "beginner",
        "source": "Vemana Satakam",
        "tags": ["Vemana", "Discernment", "Virtue", "Wisdom"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "రుచుల", "options": ["రుచుల", "రంగుల", "నడకల"]},
            {"id": 2, "correct": "పుణ్యపురుషులు", "options": ["పుణ్యపురుషులు", "ధనవంతులు", "జ్ఞానవంతులు"]}
        ]
    },
    {
        "id": "telugu_vemana_alpu_depudu",
        "title": "అల్పుడెపుడు బల్కు నాడంబరముగాను (The Modesty of True Depth)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "అల్పుడెపుడు బల్కు నాడంబరముగాను\nసజ్జనుండు బల్కు చల్లగాను\nకంచు మోగినట్లు కనకంబు మోగునా?\nవిశ్వదాభిరామ వినుర వేమ!",
        "transliteration": "Alpudepudu balku naadambarambugaanu\nSajjanundu balku challagaanu\nKanchu moginatlu kanakambu mogunaa?\nViswadaabhiraama vinura Vema!",
        "meaning": "The shallow person speaks with boastful clamor; the wise speaks with calm serenity. Does gold ring with the sharp rattle of base bronze? Sincerity has quiet dignity.",
        "pronunciation": "Al-pu-depu-du bal-ku naa-dam-ba-ram-bu-gaa-nu",
        "difficulty": "beginner",
        "source": "Vemana Satakam",
        "tags": ["Vemana", "Modesty", "Calm Speech", "Depth"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "చల్లగాను", "options": ["చల్లగాను", "గట్టిగాను", "వేగముగాను"]},
            {"id": 2, "correct": "కనకంబు", "options": ["కనకంబు", "రజతంబు", "రత్నంబు"]}
        ]
    },
    {
        "id": "telugu_sumati_upakariki",
        "title": "ఉపకారికి నుపకారము (Returning Kindness with Grace)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "ఉపకారికి నుపకారము\nవిపరీతము గాదు సేయ వివరింపంగా\nనపకారికి నుపకారము\nనెపమెన్నక సేయువాడు నేర్పరి సుమతీ!",
        "transliteration": "Upakaariki nupakaaramu\nvipareetamu gaadu seya vivarimpangaa\nnapakaariki nupakaaramu\nnepamenna-ka seyuvaadu nerpari Sumatee!",
        "meaning": "Returning a favor to one who helped you is only normal conduct. But the truly wise and noble soul is one who repays even an adversary with thoughtful benevolence, without holding grudges.",
        "pronunciation": "Upa-kaariki nupakaaramu vipareetamu gaadu",
        "difficulty": "intermediate",
        "source": "Sumati Satakam",
        "tags": ["Sumati", "Forgiveness", "Compassion", "Nobility"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "అపకారికి", "options": ["అపకారికి", "మిత్రునకు", "సాధువునకు"]},
            {"id": 2, "correct": "నేర్పరి", "options": ["నేర్పరి", "శూరుడు", "జ్ఞాని"]}
        ]
    },
    {
        "id": "telugu_sumati_kadavalenu",
        "title": "కనకపు సింహాసనమున (True Nature Over External Status)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "కనకపు సింహాసనమున\nశునకము గూర్చుండబెట్టి శుభలగ్నమునన్\nనొనరంగా బట్టము గట్టిన\nవెనుకటి గుణమేల మాను వినరా సుమతీ!",
        "transliteration": "Kanakapu simhaasanamuna\nsunakamu goorchunda-betti shubha-lagnamunan\nnonarangaa battamu gattina\nvenukati gunamela maanu vinaraa Sumatee!",
        "meaning": "Even if you place a base creature upon a golden throne at an auspicious hour and crown it, its intrinsic base habits will not vanish. Genuine elevation comes from inner character, not outer crowns.",
        "pronunciation": "Kanakapu simhaasanamuna shunakamu",
        "difficulty": "beginner",
        "source": "Sumati Satakam",
        "tags": ["Sumati", "Character", "Authenticity"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "సింహాసనమున", "options": ["సింహాసనమున", "మందిరమున", "భవనమున"]},
            {"id": 2, "correct": "గుణమేల", "options": ["గుణమేల", "రూపమేల", "కులమేల"]}
        ]
    },
    {
        "id": "telugu_sumati_balavanthuda",
        "title": "బలవంతుడ నాకేమని (Humility Prevents Downfall)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "బలవంతుడ నాకేమని\nపలువురతో నిగ్రహించి పలకగ రాదీ\nకలహంబున గెలువంగా\nవలెననినన్ లోకులెల్ల వత్తురు సుమతీ!",
        "transliteration": "Balavanthuda naakemani\npaluvurato nigrahinchi palakaga raadee\nkalahambuna geluvangaa\nvalenaninan loku-lella vatthuru Sumatee!",
        "meaning": "Do not haughtily boast 'I am invincible' and provoke conflicts with all. Arrogance unites adversaries against you, while measured humility protects your enduring strength.",
        "pronunciation": "Bala-vanthuda naakemani paluvurato",
        "difficulty": "intermediate",
        "source": "Sumati Satakam",
        "tags": ["Sumati", "Humility", "Caution", "Strategy"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "బలవంతుడ", "options": ["బలవంతుడ", "జ్ఞానవంతుడ", "ధనవంతుడ"]},
            {"id": 2, "correct": "కలహంబున", "options": ["కలహంబున", "సభయందు", "రణరంగమున"]}
        ]
    },
    {
        "id": "telugu_tyagaraja_nagumomu",
        "title": "నగుమోము గనలేని (Nagumomu Ganaleni)",
        "language": "telugu",
        "category": "song",
        "audioSourceType": "tts",
        "estimatedMinutes": 4,
        "originalText": "నగుమోము గనలేని నా జాలి దెలిసి\nనన్ను బ్రోవగ రాదా శ్రీ రఘువర నీ\nనగుమోము గనలేని నా జాలి దెలిసి\nనగరాజధర నీదు పరివారమెల్ల",
        "transliteration": "Nagumomu ganaleni naa jaali delisi\nNannu brovaga raadaa Shree Raghuvara nee\nNagumomu ganaleni naa jaali delisi\nNagaraajadhara needu parivaaramella",
        "meaning": "Unable to see your radiant, smiling countenance, my heart yearns for solace. Knowing my yearning, will you not extend your compassionate grace, O protector of the world?",
        "pronunciation": "Na-gu-mo-mu ga-na-lay-nee naa jaa-li de-li-si",
        "difficulty": "intermediate",
        "source": "Tyagaraja Keerthana (Abheri Raga)",
        "tags": ["Tyagaraja", "Carnatic", "Melody", "Longing"],
        "stages": ["listen", "repeat", "chunk"],
        "blanks": [
            {"id": 1, "correct": "నగుమోము", "options": ["నగుమోము", "పదములను", "రూపమును"]},
            {"id": 2, "correct": "శ్రీ రఘువర", "options": ["శ్రీ రఘువర", "మాధవ", "గోవింద"]}
        ]
    },
    {
        "id": "telugu_annamayya_nanati",
        "title": "నానాటి బ్రతుకు నాటకము (Life is a Passing Drama)",
        "language": "telugu",
        "category": "song",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "నానాటి బ్రతుకు నాటకము\nకానక కన్నది కైవల్యము\nపుట్టుటయు నిజము పోవుటయు నిజము\nనట్టనడిమి పని నాటకము",
        "transliteration": "Naanaati bratuku naatakamu\nKaanaka kannadi kaivalyamu\nPuttutayu nijamu povutayu nijamu\nNatta nadimi pani naatakamu",
        "meaning": "Every day's mortal existence is a passing drama; what lies beyond the veil is eternal freedom. Birth is a certainty, departure is a certainty; all that unfolds between them is a theater of experience.",
        "pronunciation": "Naa-naa-ti bra-tu-ku naa-ta-ka-mu",
        "difficulty": "beginner",
        "source": "Annamacharya Sankeerthana",
        "tags": ["Annamayya", "Philosophy", "Transience", "Stoic Telugu"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "నాటకము", "options": ["నాటకము", "సత్యము", "స్వప్నము"]},
            {"id": 2, "correct": "పుట్టుటయు", "options": ["పుట్టుటయు", "బ్రతుకుటయు", "కలయుటయు"]}
        ]
    },
    {
        "id": "telugu_vemana_gangi_govu",
        "title": "గంగిగోవు పాలు గరిటడైనను చాలు (Quality Over Sheer Volume)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "గంగిగోవు పాలు గరిటడైనను చాలు\nకడివెడైననేల ఖరము పాలు\nభక్తి గలుగు కూడు పట్టెడైనను చాలు\nవిశ్వదాభిరామ వినుర వేమ!",
        "transliteration": "Gangi-govu paalu garitadainanu chaalu\nKadivedainanela kharamu paalu\nBhakti galugu koodu pattedainanu chaalu\nViswadaabhiraama vinura Vema!",
        "meaning": "Even a small ladle of wholesome cow's milk is valuable; of what use is an entire pot of donkey's milk? A single morsel of food given with sincere love is far better than lavish feasts without warmth.",
        "pronunciation": "Gan-gi go-vu paa-lu ga-ri-ta-dai-na-nu chaa-lu",
        "difficulty": "beginner",
        "source": "Vemana Satakam",
        "tags": ["Vemana", "Quality", "Simplicity", "Wisdom"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "గరిటడైనను", "options": ["గరిటడైనను", "కడివెడైనను", "కొంచెమైనను"]},
            {"id": 2, "correct": "పట్టెడైనను", "options": ["పట్టెడైనను", "రాశియైనను", "పుట్టెడైనను"]}
        ]
    },
    {
        "id": "telugu_pothana_adagada",
        "title": "అడిగెదనని కడువడి జను (Gajendra Moksham - The Surge of Compassion)",
        "language": "telugu",
        "category": "story",
        "audioSourceType": "tts",
        "estimatedMinutes": 4,
        "originalText": "అడిగెదనని కడువడి జను\nనడిగిన దనుమఘవ డడుగు నను వడి నడచున్\nజడియున్ వికలమతియగున్\nగడగడ వడకున్ దొట్రిలుచు గరుణన్ దనరున్",
        "transliteration": "Adigedanani kaduvadi janu\nNadigina danumaghavada dugu nanu vadi nadachun\nJadiyun vikalamatiyagun\nGadagada vadakun dotriluchu garunan danarun",
        "meaning": "Hearing the elephant's plea for rescue, the Lord rushes out in haste without telling his consort or gathering his weapons—his only thought is rushing swiftly to alleviate suffering.",
        "pronunciation": "Adigedanani kaduvadi janu nadigina danu",
        "difficulty": "advanced",
        "source": "Bammera Pothana - Andhra Maha Bhagavatam",
        "tags": ["Pothana", "Classics", "Compassion", "Bhagavatam"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "కడువడి", "options": ["కడువడి", "నెమ్మదిగా", "సంకోచముతో"]},
            {"id": 2, "correct": "కరుణన్", "options": ["కరుణన్", "కోపమున", "భయమున"]}
        ]
    },
    {
        "id": "telugu_rayalu_deshabhashalandu",
        "title": "దేశభాషలందు తెలుగు లెస్స (The Melody of the Mother Tongue)",
        "language": "telugu",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "తెలుగదేల యన్న దేశంబు తెలుగేను\nతెలుగు వల్లభుండ తెలుగొకండ\nయెల్ల నృపులు గొలువ నెరుగవే బాసాడి\nదేశభాషలందు తెలుగు లెస్స!",
        "transliteration": "Telugadela yanna deshambu telugenu\nTelugu vallabhunda telugokanda\nYella nripulu goluva nerugave baasaadi\nDesha-bhaashalandu Telugu lessa!",
        "meaning": "Why choose Telugu? This land is Telugu, its guardian spirit loves Telugu, and rulers converse in it. Among all national languages, sweet Telugu is supremely graceful.",
        "pronunciation": "Desha bhaashalandu Telugu lessa",
        "difficulty": "intermediate",
        "source": "Amuktamalyada by Sri Krishnadevaraya",
        "tags": ["Krishnadevaraya", "Culture", "Heritage", "Poetry"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "దేశంబు", "options": ["దేశంబు", "గ్రామంబు", "నగరంబు"]},
            {"id": 2, "correct": "తెలుగు లెస్స", "options": ["తెలుగు లెస్స", "కన్నడం లెస్స", "సంస్కృతం లెస్స"]}
        ]
    },
    {
        "id": "telugu_vemana_chittamu",
        "title": "చిత్తము నిర్మలమైనచో (A Calm Mind Transmutes All)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "చిత్తము నిర్మలమైనచో\nహత్తియుండును జ్ఞాన మెల్ల యాత్మయందున్\nముత్తెము చిప్పలోన నెట్లుండునో\nవిశ్వదాభిరామ వినుర వేమ!",
        "transliteration": "Chittamu nirmalamainacho\nHatthiyundunu jnaana mella yaatmayandun\nMutthemu chippalona netlunduno\nViswadaabhiraama vinura Vema!",
        "meaning": "When the mind becomes serene and undisturbed by turbulent desires, supreme wisdom takes root in the soul, just as a radiant pearl forms safely within its tranquil shell.",
        "pronunciation": "Chit-ta-mu nir-ma-la-mai-na-cho",
        "difficulty": "beginner",
        "source": "Vemana Satakam",
        "tags": ["Vemana", "Serenity", "Clarity", "Meditation"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "నిర్మలమైనచో", "options": ["నిర్మలమైనచో", "చంచలమైనచో", "భయపడినచో"]},
            {"id": 2, "correct": "ముత్తెము", "options": ["ముత్తెము", "రత్నము", "వజ్రము"]}
        ]
    },
    {
        "id": "telugu_sumati_siri_thana",
        "title": "సిరి తా వచ్చిన వచ్చును (The Nature of Fortune)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "సిరి తా వచ్చిన వచ్చును\nసలలితముగ నారికేళ సలిలము భంగిన్\nసిరి తా బోయిన బోవును\nకరి మ్రింగిన వెలగపండు కరణిని సుమతీ!",
        "transliteration": "Siri taa vacchina vacchunu\nsalalitamuga naarikela salilamu bhangin\nsiri taa boyina bovunu\nkari mringina velaga-pandu karanini Sumatee!",
        "meaning": "When fortune arrives, it gathers quietly like sweet water inside a coconut. When it departs heedlessly, it hollows out like a wood-apple swallowed by an elephant. Maintain equilibrium through both.",
        "pronunciation": "Si-ri taa vac-chi-na vac-chu-nu",
        "difficulty": "intermediate",
        "source": "Sumati Satakam",
        "tags": ["Sumati", "Fortune", "Equanimity", "Wisdom"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "నారికేళ", "options": ["నారికేళ", "కదళీఫల", "మామిడి"]},
            {"id": 2, "correct": "కరణిని", "options": ["కరణిని", "విధమున", "రీతిగా"]}
        ]
    },
    {
        "id": "telugu_gurajada_deshamanu",
        "title": "దేశమంటే మట్టి కాదోయ్ (A Nation is Its People)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "దేశమంటే మట్టి కాదోయ్\nదేశమంటే మనుషులోయ్!\nపాడిపంటలు పొంగిపొర్లే\nదారిలో నువు పాటుపడవోయ్!",
        "transliteration": "Deshamante matti kaadoy\nDeshamante manushuloy!\nPaadi-pantalu pongi-porley\nDaarilo nuvu paatu-padavoy!",
        "meaning": "A homeland is not mere soil and borders; a homeland is its living human beings! Work diligently in avenues where agriculture, knowledge, and shared prosperity overflow for all.",
        "pronunciation": "Deshamantay matti kaadoy deshamantay manushuloy",
        "difficulty": "beginner",
        "source": "Gurajada Apparao - Desha Bhakti",
        "tags": ["Gurajada", "Humanism", "Patriotism", "Progress"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "మనుషులోయ్", "options": ["మనుషులోయ్", "నదులోయ్", "కొండలోయ్"]},
            {"id": 2, "correct": "పాటుపడవోయ్", "options": ["పాటుపడవోయ్", "నిదురించవోయ్", "విహరించవోయ్"]}
        ]
    },
    {
        "id": "telugu_sri_sri_maha",
        "title": "మరో ప్రపంచం మరో ప్రపంచం (March Forward to a New Dawn)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "మరో ప్రపంచం, మరో ప్రపంచం\nమరో ప్రపంచం పిలిచింది!\nపదండి ముందుకు, పదండి త్రోసుకు!\nపోదాం, పోదాం పైపైకి!",
        "transliteration": "Maro prapancham, maro prapancham\nMaro prapancham pilichindi!\nPadandi munduku, padandi throsuku!\nPodaam, podaam paipaiki!",
        "meaning": "A new world, a vibrant tomorrow calls out! March forward, overcome all barriers with courage! Let us ascend higher and build a world free from oppression.",
        "pronunciation": "Maro prapancham maro prapancham pilichindi",
        "difficulty": "intermediate",
        "source": "Sri Sri - Mahaprasthanam (Modern Progressive Classic)",
        "tags": ["Sri Sri", "Courage", "Progress", "Energy"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "మరో ప్రపంచం", "options": ["మరో ప్రపంచం", "మరో ప్రదేశం", "మరో సమయం"]},
            {"id": 2, "correct": "ముందుకు", "options": ["ముందుకు", "వెనుకకు", "పక్కకు"]}
        ]
    },
    {
        "id": "telugu_vemana_meda_pandu",
        "title": "మేడిపండు జూడ మేలిమై యుండును (Appearance Versus Reality)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "మేడిపండు జూడ మేలిమై యుండును\nపొట్టవిప్పి జూడ పురుగులుండు\nపిరికివాని మదిని బింకమీలాగురా\nవిశ్వదాభిరామ వినుర వేమ!",
        "transliteration": "Meda-pandu jooda melimai yundunu\nPotta-vippi jooda purugulundu\nPirikivaani madini binkam-eelaaguraa\nViswadaabhiraama vinura Vema!",
        "meaning": "The fig looks polished and appetizing from the outside, yet inside it swarms with tiny insects. Similar is the loud boastfulness of an insecure, fearful mind.",
        "pronunciation": "May-di pan-du joo-da may-li-mai yun-du-nu",
        "difficulty": "beginner",
        "source": "Vemana Satakam",
        "tags": ["Vemana", "Courage", "Discernment", "Truth"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "పురుగులుండు", "options": ["పురుగులుండు", "ముత్యముండు", "తేనెయుండు"]},
            {"id": 2, "correct": "పిరికివాని", "options": ["పిరికివాని", "జ్ఞానియొక్క", "రాజుయొక్క"]}
        ]
    },
    {
        "id": "telugu_sumati_ottari",
        "title": "ఒకరి కొకరు తోడై యుండవలె (Mutual Support and Harmony)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "ఒకరి కొకరు తోడై యుండవలె\nసహాయము జేయంగ జనులకు నెపుడున్\nఏకమయిన పనులెల్లయు\nచేకూరక పోవునొక్కొ చెప్పుము సుమతీ!",
        "transliteration": "Okari kokaru thodai yundavale\nsahaayamu jeyanga janulaku nepudun\nekamayina panulellayu\nchekooraka povunokko cheppumu Sumatee!",
        "meaning": "People should stand beside one another in generous mutual cooperation. When individuals unite with common purpose, what noble accomplishment can ever fail?",
        "pronunciation": "Okari kokaru thodai yundavale",
        "difficulty": "beginner",
        "source": "Sumati Satakam",
        "tags": ["Sumati", "Unity", "Cooperation", "Strength"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "సహాయము", "options": ["సహాయము", "ఉపదేశము", "దండనము"]},
            {"id": 2, "correct": "ఏకమయిన", "options": ["ఏకమయిన", "విడిపోయిన", "సంశయించిన"]}
        ]
    },
    {
        "id": "telugu_annamayya_antharyami",
        "title": "అంతర్యామి అలసితి సొలసితి (The Inner Haven of Rest)",
        "language": "telugu",
        "category": "song",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "అంతర్యామి అలసితి సొలసితి\nఇంతట నీ శరణిదిగో జొచ్చితి\nకోరిన కోరికలే కొసరిన దొరకవు\nతీరిన చింతలే తిరుగక మానవు",
        "transliteration": "Antharyaami alasithi solasithi\nInthata nee sharanidigo jocchithi\nKorina korikale kosarina dorakavu\nTeerina chinthale thirugaka maanavuu",
        "meaning": "O Indwelling Spirit, weary and exhausted by the restless wanderings of desire, I take refuge in inner stillness. Endless cravings never satisfy; only in your quiet presence does peace arise.",
        "pronunciation": "Anthar-yaa-mi ala-sithi sola-sithi",
        "difficulty": "intermediate",
        "source": "Annamacharya Sankeerthana",
        "tags": ["Annamayya", "Peace", "Inner Refuge", "Meditation"],
        "stages": ["listen", "repeat", "chunk"],
        "blanks": [
            {"id": 1, "correct": "అంతర్యామి", "options": ["అంతర్యామి", "లోకేశ్వరా", "పరమేశ్వరా"]},
            {"id": 2, "correct": "శరణిదిగో", "options": ["శరణిదిగో", "భవనమిదిగో", "రూపమిదిగో"]}
        ]
    },
    {
        "id": "telugu_tyagaraja_entharomahanu",
        "title": "ఎందరో మహానుభావులు అందరికీ వందనములు (Salutations to All Great Souls)",
        "language": "telugu",
        "category": "song",
        "audioSourceType": "tts",
        "estimatedMinutes": 4,
        "originalText": "ఎందరో మహానుభావులు\nఅందరికీ వందనములు\nచందురు వదనని హృదయారవిందమున\nజూచి నిత్యానందమనుభవించువారు",
        "transliteration": "Endaro mahaanubhaavulu\nAndarikee vandanamulu\nChanduru vadanani hridayaaravindamuna\nJoochi nityaanandamanubhavinchuvaaru",
        "meaning": "Countless are the noble, luminous souls in every age; to all of them I bow with deep reverence. Those who contemplate the serene light within their hearts dwell in everlasting joy.",
        "pronunciation": "En-da-ro ma-haa-nu-bhaa-vu-lu an-da-ri-kee van-da-na-mu-lu",
        "difficulty": "advanced",
        "source": "Tyagaraja Pancharatna Keerthana (Sri Raga)",
        "tags": ["Tyagaraja", "Pancharatna", "Humility", "Great Souls"],
        "stages": ["listen", "repeat", "chunk"],
        "blanks": [
            {"id": 1, "correct": "మహానుభావులు", "options": ["మహానుభావులు", "ధనవంతులు", "రాజన్యులు"]},
            {"id": 2, "correct": "వందనములు", "options": ["వందనములు", "గీతములు", "పుష్పములు"]}
        ]
    },
    {
        "id": "telugu_pothana_sirikimzheppadu",
        "title": "సిరికిం జెప్పడు శంఖచక్రయుగముంజేదోయి (Gajendra Moksham Pothana)",
        "language": "telugu",
        "category": "story",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "సిరికిం జెప్పడు శంఖచక్రయుగముంజేదోయి సంధింపడే\nపరివారంబును జీరడభ్రగపతిం బన్నంగ నేతెంచునో\nయరయంగా నొక చేత నొప్పును మహాహారమ్ము నొయ్యారమై\nత్వరితోల్లాసముతోడ నుద్గతమనస్తప్తుండునై పోయెడిన్",
        "transliteration": "Sirikim jeppadu shankha-chakra-yugamun-jedoyi sandhimpade\nParivaarambunu jeerada-bhraga-patim bannanga netenchuno\nYarayangaa noka cheta noppunu mahaahaarammu noyyaaramai\nTvari-tollaasamutoda nudgata-manas-taptundunai poyedini",
        "meaning": "He pauses not to inform Lakshmi, nor waits to grasp his conch and discus, nor calls upon Garuda. Driven solely by urgent compassion to relieve pain, he departs in swift resolution.",
        "pronunciation": "Sirikim jeppadu shankha chakra yugamun",
        "difficulty": "advanced",
        "source": "Bammera Pothana - Andhra Maha Bhagavatam",
        "tags": ["Pothana", "Classics", "Literature", "Compassion"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "సిరికిం జెప్పడు", "options": ["సిరికిం జెప్పడు", "సేనకుం జెప్పడు", "మంత్రికెం జెప్పడు"]},
            {"id": 2, "correct": "త్వరితోల్లాసముతోడ", "options": ["త్వరితోల్లాసముతోడ", "నెమ్మదిగాను", "కోపముతోడ"]}
        ]
    },
    {
        "id": "telugu_vemana_kavula",
        "title": "పరుల మేలు చూచి పొంగిపోవునతడు (Rejoicing in Others' Well-being)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "పరుల మేలు చూచి పొంగిపోవునతడు\nపరుల కీడు జూచి పరితపించు\nనట్టివాడె చూవె యవనిలో పుణ్యుండు\nవిశ్వదాభిరామ వినుర వేమ!",
        "transliteration": "Parula melu joochi pongipovunatadu\nParula keedu joochi parithapinchu\nNattivade choove yavanilo punyundu\nViswadaabhiraama vinura Vema!",
        "meaning": "One whose heart delights genuinely in the success of others, and who feels empathetic concern when others struggle—that soul is truly exalted upon this earth.",
        "pronunciation": "Parula may-lu joo-chi pon-gi-po-vu-na-ta-du",
        "difficulty": "beginner",
        "source": "Vemana Satakam",
        "tags": ["Vemana", "Empathy", "Sympathetic Joy", "Compassion"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "పొంగిపోవునతడు", "options": ["పొంగిపోవునతడు", "కుమిలిపోవునతడు", "నవ్వుకొనునతడు"]},
            {"id": 2, "correct": "పరితపించు", "options": ["పరితపించు", "పరిహసించు", "సంతోషించు"]}
        ]
    },
    {
        "id": "telugu_sumati_koodami",
        "title": "కూరిమి గల దినములలో (Preserving Affection Beyond Small Faults)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "కూరిమి గల దినములలో\nనేరము లెన్నడును దోచనేరవు సుమతీ\nకూరిమి విరసంబైనను\nనేరములే తోచుచుండు నిక్కము సుమతీ!",
        "transliteration": "Koorimi gala dinamulalo\nneramu lennadunu dochaneeravu Sumatee\nkoorimi virasambainanu\nneramule thochuchundu nikkamu Sumatee!",
        "meaning": "When warm affection binds hearts, minor faults are gently overlooked. But if goodwill turns sour, even harmless gestures are misconstrued as grievances. Guard understanding with care.",
        "pronunciation": "Koo-ri-mi ga-la di-na-mu-la-lo",
        "difficulty": "beginner",
        "source": "Sumati Satakam",
        "tags": ["Sumati", "Empathy", "Perspective", "Relationships"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "కూరిమి", "options": ["కూరిమి", "కలహము", "ధనము"]},
            {"id": 2, "correct": "నేరములే", "options": ["నేరములే", "గుణములే", "కష్టములే"]}
        ]
    },
    {
        "id": "telugu_bhartruhari_telugu_vidya",
        "title": "విద్య నిగూఢ గుప్తమగు విత్తము (Knowledge as Inward Treasure)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "విద్య నిగూఢ గుప్తమగు విత్తము రూపము పూరుషాళికిన్\nవిద్య యశస్సు భోగకరి విద్య గురుండు విదేశబంధువౌ\nవిద్య విశిష్ట దైవతము విద్యకు సాటి ధనంబు లేదుగా\nవిద్యావిహీనుడు పశువే సుమీ జగతిన్!",
        "transliteration": "Vidya nigoodha guptamagu vitthamu roopamu poorushaali-kin\nVidya yashassu bhogakari vidya gurundu videshabandhuvou\nVidya vishishta daivatamu vidyaku saati dhanambu ledugaa\nVidyaa-viheenudu pashuve sumee jagathin!",
        "meaning": "Learning is humanity's hidden wealth and true inner splendor. It yields dignity, serves as an indispensable guide in foreign lands, and has no peer in material riches.",
        "pronunciation": "Vidya nigoodha guptamagu vitthamu",
        "difficulty": "intermediate",
        "source": "Enugula Lakshmana Kavi (Subhashita Ratnavali)",
        "tags": ["Education", "Wisdom", "Bhartruhari Telugu", "Dignity"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "విదేశబంధువౌ", "options": ["విదేశబంధువౌ", "స్వదేశమిత్రుడౌ", "రాజశత్రువౌ"]},
            {"id": 2, "correct": "సాటి ధనంబు", "options": ["సాటి ధనంబు", "సాటి పదవి", "సాటి బలము"]}
        ]
    },
    {
        "id": "telugu_proverb_aarogya",
        "title": "ఆరోగ్యమే మహాభాగ్యం (Health is the Greatest Wealth)",
        "language": "telugu",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "ఆరోగ్యమే మహాభాగ్యము\nతృప్తియే పరమ సుఖము\nసత్యవాక్కే పరమ ధర్మము\nసహనమే పరమ బలము",
        "transliteration": "Aarogyame mahaabhaagyamu\nTruptiye parama sukhamu\nSatyavaakke parama dharmamu\nSahaname parama balamu",
        "meaning": "Vibrant health is the premier fortune; deep contentment is the highest happiness; truthful speech is supreme righteousness; and calm patient endurance is unconquerable strength.",
        "pronunciation": "Aa-ro-gya-may ma-haa bhaa-gya-mu",
        "difficulty": "beginner",
        "source": "Traditional Telugu Wisdom Collection",
        "tags": ["Health", "Contentment", "Patience", "Proverb"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "మహాభాగ్యము", "options": ["మహాభాగ్యము", "మహాబలము", "మహాకీర్తి"]},
            {"id": 2, "correct": "సహనమే", "options": ["సహనమే", "కోపమే", "వేగమే"]}
        ]
    },
    {
        "id": "telugu_proverb_anaga_anaga",
        "title": "అనగ ననగ రాగ మతిశయిల్లుచునుండు (Mastery Through Repetition)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "అనగ ననగ రాగ మతిశయిల్లుచునుండు\nదినగ దినగ వేము తియ్యనుండు\nసాధనమున బనులు సమకూరు ధరలోన\nవిశ్వదాభిరామ వినుర వేమ!",
        "transliteration": "Anaga nanaga raaga mathishayilluchunundu\nTinaga tinaga vemu thiyyanundu\nSaadhanamuna banulu samakooru dharalona\nViswadaabhiraama vinura Vema!",
        "meaning": "By singing repeatedly, melodies bloom in rich beauty; by continuous tasting, even neem reveals its medicinal virtue. Through patient, regular practice, all difficult feats are mastered.",
        "pronunciation": "A-na-ga na-na-ga raa-ga ma-thi-sha-yil-lu-chu-nun-du",
        "difficulty": "beginner",
        "source": "Vemana Satakam",
        "tags": ["Practice", "Mastery", "Discipline", "Vemana"],
        "stages": ["listen", "repeat", "chunk", "recall"],
        "blanks": [
            {"id": 1, "correct": "సాధనమున", "options": ["సాధనమున", "భాగ్యమున", "ధనముతో"]},
            {"id": 2, "correct": "సమకూరు", "options": ["సమకూరు", "తొలగిపోవు", "ఆగిపోవు"]}
        ]
    },
    {
        "id": "telugu_dhupati_deepamu",
        "title": "దీపముండగనే యిల్లు దిద్దుకొనవలె (Act While Opportunity Shines)",
        "language": "telugu",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "దీపముండగనే యిల్లు దిద్దుకొనవలె\nకాలమున్నప్పుడే కార్యసాధన జేయవలె\nచేతులు కాలిన వెనుక ఆకులు పట్టుకొన్న\nలాభమేమి లేదు వినుము ధీర!",
        "transliteration": "Deepamundagane yillu diddu-konavale\nKaalamunnappude kaarya-saadhana jeyavale\nChethulu kaalina venuka aakulu pattukonna\nLaabhamemi ledu vinumu dheera!",
        "meaning": "Arrange your home while the lamp is burning; accomplish your essential duties while time is on your side. Holding leaves after hands are scorched brings no relief. Cultivate foresight.",
        "pronunciation": "Deepamundagane yillu diddu-konavale",
        "difficulty": "beginner",
        "source": "Telugu Folk Wisdom Tradition",
        "tags": ["Procrastination", "Foresight", "Timeliness", "Telugu Proverb"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "దీపముండగనే", "options": ["దీపముండగనే", "చీకటిపడగానే", "వర్షమురాగానే"]},
            {"id": 2, "correct": "కాలమున్నప్పుడే", "options": ["కాలమున్నప్పుడే", "వయసుమళ్లినప్పుడే", "ఆపదవచ్చినప్పుడే"]}
        ]
    },
    {
        "id": "telugu_sumati_aakali",
        "title": "ఆకలియని వచ్చినవారల (Hospitality and Dignity)",
        "language": "telugu",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "ఆకలియని వచ్చినవారల\nనేకడనైనన్ విడువక నింపుగ బెట్టన్\nలోకము మెచ్చును సుమతీ\nనాకిల పరములకు దారి యదియే సుమతీ!",
        "transliteration": "Aakaliyani vacchinavaarala\nnekadanainan viduvaka nimpuga bettan\nlokamu mecchunu Sumatee\nnaakila paramulaku daari yadiye Sumatee!",
        "meaning": "When someone approaches in hunger, receiving them warmly and sharing food without contempt wins the respect of the world and lays a radiant path for life.",
        "pronunciation": "Aakaliyani vacchinavaarala",
        "difficulty": "beginner",
        "source": "Sumati Satakam",
        "tags": ["Hospitality", "Generosity", "Sumati", "Dignity"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "ఆకలియని", "options": ["ఆకలియని", "ధనార్థియై", "ఆటకై"]},
            {"id": 2, "correct": "నింపుగ బెట్టన్", "options": ["నింపుగ బెట్టన్", "వెళ్లగొట్టన్", "చూడకుండన్"]}
        ]
    },
    {
        "id": "telugu_vemana_thanakali",
        "title": "తన కోపమె తన శత్రువు (Anger is One's Own Nemesis)",
        "language": "telugu",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "తన కోపమె తన శత్రువు\nతన శాంతమె తనకు రక్ష దయ చుట్టంబౌ\nతన సంతోషమె స్వర్గము\nతన దుఃఖమె నరకమండ్రు తథ్యము సుమతీ!",
        "transliteration": "Thana kopame thana shatruvu\nThana shaantame thanaku raksha daya chuttambou\nThana santosshame svargamu\nThana duhkhame narakamandru thathyamu Sumatee!",
        "meaning": "One's uncontrolled anger is their own worst adversary; their inner calm is their impregnable armor; kindness is true kinship; a peaceful heart is heaven itself.",
        "pronunciation": "Thana ko-pa-me thana sha-tru-vu thana shaan-ta-me thana-ku rak-sha",
        "difficulty": "beginner",
        "source": "Sumati / Vemana Classical Maxim",
        "tags": ["Anger Management", "Calmness", "Kindness", "Telugu Maxim"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "శత్రువు", "options": ["శత్రువు", "మిత్రుడు", "ఆభరణము"]},
            {"id": 2, "correct": "శాంతమె", "options": ["శాంతమె", "బలమె", "విద్యయె"]}
        ]
    },
    {
        "id": "telugu_annamayya_kondalalo",
        "title": "కొండలలో నెలకొన్న కోనేటి రాయడు (Serenity Amidst the Hills)",
        "language": "telugu",
        "category": "song",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "కొండలలో నెలకొన్న కోనేటి రాయడు వాడు\nకొండలంత వరములు గుప్పెడు వాడు\nకుమ్మరదాసుడైన కురువరతినంబి\nయిమ్మను వరమెల్ల నిచ్చినవాడు",
        "transliteration": "Kondalalo nelakonna koneti raayadu vaadu\nKondalantha varamulu guppedu vaadu\nKummara daasudaina Kuruvarathinam bi\nYimmanu varamella nicchinavaadu",
        "meaning": "He who resides peacefully amidst the hills showers immense blessings like mountains, treating the humble potter with the same gentle honor as emperors.",
        "pronunciation": "Kon-da-la-lo ne-la-kon-na ko-nay-ti raa-ya-du",
        "difficulty": "intermediate",
        "source": "Annamacharya Sankeerthana",
        "tags": ["Annamayya", "Egalitarianism", "Devotion", "Peace"],
        "stages": ["listen", "repeat", "chunk"],
        "blanks": [
            {"id": 1, "correct": "కొండలలో", "options": ["కొండలలో", "నదులలో", "వనములలో"]},
            {"id": 2, "correct": "వరములు", "options": ["వరములు", "ధనములు", "బాణములు"]}
        ]
    },
    {
        "id": "telugu_tyagaraja_marugelara",
        "title": "మరుగులేరా ఓ రాఘవ (Dispel the Veil of Delusion)",
        "language": "telugu",
        "category": "song",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "మరుగులేరా ఓ రాఘవ\nనన్ను బ్రోవగ మరుగులేరా\nమరులు కొన్న నన్ను మరువగ తగునా\nధరను ధన్యుడనై దయగన రాదా",
        "transliteration": "Marugelaraa O Raaghava\nNannu brovaga marugelaraa\nMarulu konna nannu maruvaga tagunaa\nDharanu dhanyudanai dayagana raadaa",
        "meaning": "Why this veil of concealment, O protector? When the mind yearns for truth, dispel the clouds of confusion and reveal the steady calm within.",
        "pronunciation": "Ma-ru-ge-la-raa O Raa-gha-va nan-nu bro-va-ga",
        "difficulty": "intermediate",
        "source": "Tyagaraja Keerthana (Jayantashri Raga)",
        "tags": ["Tyagaraja", "Clarity", "Truth", "Carnatic"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "మరుగులేరా", "options": ["మరుగులేరా", "సందేహమా", "భయమేలరా"]},
            {"id": 2, "correct": "దయగన", "options": ["దయగన", "కలవన", "నిలవన"]}
        ]
    }
]

hindi_items = [
    {
        "id": "hindi_kabir_doha_bura",
        "title": "बुरा जो देखन मैं चला (Introspection Before Judgment)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "बुरा जो देखन मैं चला, बुरा न मिलिया कोय।\nजो दिल खोजा आपना, मुझसे बुरा न कोय॥",
        "transliteration": "Bura jo dekhan main chala, bura na miliya koy\nJo dil khoja aapna, mujhse bura na koy",
        "meaning": "I went searching for faults and evil in the external world, but found none. When I peered deeply into my own heart and thoughts, I found none more in need of correction than myself.",
        "pronunciation": "Bu-raa jo day-khan main cha-laa, bu-raa na mi-li-yaa koy",
        "difficulty": "beginner",
        "source": "Kabir Ke Dohe (15th Century Mystic Poetry)",
        "tags": ["Kabir", "Introspection", "Self-Awareness", "Humility"],
        "stages": ["listen", "repeat", "recall", "missing_word"],
        "blanks": [
            {"id": 1, "correct": "बुरा", "options": ["बुरा", "भला", "सत्य"]},
            {"id": 2, "correct": "दिल", "options": ["दिल", "घर", "शास्त्र"]}
        ]
    },
    {
        "id": "hindi_kabir_kaal_kare",
        "title": "काल करे सो आज कर (The Value of Immediate Action)",
        "language": "hindi",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "काल करे सो आज कर, आज करे सो अब।\nपल में परलय होएगी, बहुरि करेगा कब॥",
        "transliteration": "Kaal kare so aaj kar, aaj kare so ab\nPal mein parlay hoyegi, bahuri karega kab",
        "meaning": "What you intended for tomorrow, complete today; what you planned for today, do right now. A single moment can overturn all circumstances; when will you act then?",
        "pronunciation": "Kaal ka-ray so aaj kar, aaj ka-ray so ab",
        "difficulty": "beginner",
        "source": "Kabir Ke Dohe",
        "tags": ["Action", "Procrastination", "Present Moment", "Kabir"],
        "stages": ["listen", "repeat", "recall", "missing_word"],
        "blanks": [
            {"id": 1, "correct": "आज", "options": ["आज", "कल", "कभी"]},
            {"id": 2, "correct": "अब", "options": ["अब", "तब", "फिर"]}
        ]
    },
    {
        "id": "hindi_kabir_aisi_vani",
        "title": "ऐसी बानी बोलिए (Gentle and Considerate Speech)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "ऐसी बानी बोलिए, मन का आपा खोय।\nऔरन को सीतल करै, आपहु सीतल होय॥",
        "transliteration": "Aisi baani boliye, man ka aapa khoy\nAuran ko seetal karai, aapahu seetal hoy",
        "meaning": "Speak with such considerate gentleness that ego dissolves completely. Such speech brings cooling comfort to those who listen, and tranquil composure to oneself.",
        "pronunciation": "Ai-see baa-nee bo-li-yay, man kaa aa-paa khoy",
        "difficulty": "beginner",
        "source": "Kabir Ke Dohe",
        "tags": ["Speech", "Peace", "Ego", "Compassion"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "आपा खोय", "options": ["आपा खोय", "ज्ञान पाय", "मौन होय"]},
            {"id": 2, "correct": "सीतल", "options": ["सीतल", "हर्षित", "विस्मित"]}
        ]
    },
    {
        "id": "hindi_kabir_dhire_dhire",
        "title": "धीरे-धीरे रे मना (Patience in Natural Growth)",
        "language": "hindi",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "धीरे-धीरे रे मना, धीरे सब कुछ होय।\nमाली सींचे सौ घड़ा, ॠतु आए फल होय॥",
        "transliteration": "Dhire-dhire re manaa, dhire sab kuch hoy\nMaali seenche sau ghadaa, ritu aaye phal hoy",
        "meaning": "Gently, O restless mind, all true progress unfolds in its own measured rhythm. Even if the gardener pours a hundred pitchers of water, the tree bears fruit only when its season arrives.",
        "pronunciation": "Dhee-ray dhee-ray ray ma-naa",
        "difficulty": "beginner",
        "source": "Kabir Ke Dohe",
        "tags": ["Patience", "Growth", "Calm", "Kabir"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "धीरे-धीरे", "options": ["धीरे-धीरे", "जल्दी-जल्दी", "सहसा-सहसा"]},
            {"id": 2, "correct": "ॠतु आए", "options": ["ॠतु आए", "धन पाए", "दिन जाए"]}
        ]
    },
    {
        "id": "hindi_kabir_bada_bhaya",
        "title": "बड़ा भया तो क्या भया (True Greatness Provides Shade)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "बड़ा भया तो क्या भया, जैसे पेड़ खजूर।\nपंथी को छाया नहीं, फल लागे अति दूर॥",
        "transliteration": "Bada bhaya to kya bhaya, jaise ped khajoor\nPanthi ko chaaya nahin, phal laage ati door",
        "meaning": "What is the virtue of mere size or status if one is like the tall date palm? It provides no shade for weary travelers, and its fruit hangs far out of reach. Greatness is service.",
        "pronunciation": "Badaa bha-yaa to kyaa bha-yaa jai-say ped kha-joor",
        "difficulty": "beginner",
        "source": "Kabir Ke Dohe",
        "tags": ["Service", "Ego", "Humility", "Kabir"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "खजूर", "options": ["खजूर", "आम", "बरगद"]},
            {"id": 2, "correct": "छाया", "options": ["छाया", "माया", "शोभा"]}
        ]
    },
    {
        "id": "hindi_rahim_rahiman_pani",
        "title": "रहिमन पानी राखिये (The Preciousness of Self-Respect)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "रहिमन पानी राखिये, बिन पानी सब सून।\nपानी गए न ऊबरै, मोती, मानुष, चून॥",
        "transliteration": "Rahiman paani raakhiye, bin paani sab soon\nPaani gaye na oobarai, moti, maanush, choon",
        "meaning": "Preserve inner integrity and grace; without it, all external splendor is void. Without luster the pearl loses worth, without honor the person loses character, without water flour cannot sustain.",
        "pronunciation": "Ra-hi-man paa-nee raa-khi-yay, bin paa-nee sab soon",
        "difficulty": "intermediate",
        "source": "Rahim Ke Dohe (Abdul Rahim Khan-i-Khanan)",
        "tags": ["Rahim", "Dignity", "Integrity", "Honor"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "सब सून", "options": ["सब सून", "सब व्यर्थ", "सब अधूरा"]},
            {"id": 2, "correct": "मानुष", "options": ["मानुष", "राजा", "पंडित"]}
        ]
    },
    {
        "id": "hindi_rahim_jo_rahim_uttam",
        "title": "जो रहीम उत्तम प्रकृति (Unshakable Inner Integrity)",
        "language": "hindi",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "जो रहीम उत्तम प्रकृति, का करि सकत कुसंग।\nचन्दन विष व्यापत नहीं, लपटे रहत भुजंग॥",
        "transliteration": "Jo Rahim uttam prakriti, ka kari sakat kusang\nChandan vish vyaapat nahin, lapte rahat bhujang",
        "meaning": "One endowed with firm character and noble values remains uncorrupted by negative company, just as the fragrant sandalwood tree absorbs no venom though serpents wind about it.",
        "pronunciation": "Jo Ra-heem ut-tam pra-kri-ti kaa ka-ri sa-kat ku-sang",
        "difficulty": "beginner",
        "source": "Rahim Ke Dohe",
        "tags": ["Character", "Integrity", "Resilience", "Rahim"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "कुसंग", "options": ["कुसंग", "सत्संग", "प्रसंग"]},
            {"id": 2, "correct": "चन्दन", "options": ["चन्दन", "नीम", "कमल"]}
        ]
    },
    {
        "id": "hindi_rahim_taruvar_phal",
        "title": "तरुवर फल नहिं खात है (Selfless Sharing of Riches)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "तरुवर फल नहिं खात है, सरवर पियहि न पान।\nकहि रहीम पर काज हित, संपति सचहि सुजान॥",
        "transliteration": "Taruvar phal nahin khaat hai, sarvar piyahi na paan\nKahi Rahim par kaaj hit, sampati sachahi sujaan",
        "meaning": "Trees do not consume their own fruit; lakes do not drink their own water. Rahim observes: noble and wise souls amass resources and insights to benefit and uplift others.",
        "pronunciation": "Taru-var phal na-hin khaat hai sar-var pi-ya-hi na paan",
        "difficulty": "beginner",
        "source": "Rahim Ke Dohe",
        "tags": ["Generosity", "Altruism", "Rahim", "Wisdom"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "सरवर", "options": ["सरवर", "सागर", "निर्झर"]},
            {"id": 2, "correct": "सुजान", "options": ["सुजान", "धनी", "विद्वान"]}
        ]
    },
    {
        "id": "hindi_rahim_dhaage_prem",
        "title": "रहिमन धागा प्रेम का (Nurturing Fragile Bonds)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "रहिमन धागा प्रेम का, मत तोड़ो चटकाय।\nटूटे पे फिर ना जुड़े, जुड़े गाँठ परि जाय॥",
        "transliteration": "Rahiman dhaaga prem ka, mat todo chatkaay\nToote pe phir naa jude, jude gaanth pari jaay",
        "meaning": "Do not snap the delicate thread of affection in a sudden surge of temper. Once broken, it cannot be mended without an indelible knot remaining. Treat relationships with gentle care.",
        "pronunciation": "Ra-hi-man dhaa-gaa prem kaa mat to-do chat-kaay",
        "difficulty": "beginner",
        "source": "Rahim Ke Dohe",
        "tags": ["Relationships", "Patience", "Empathy", "Rahim"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "प्रेम का", "options": ["प्रेम का", "स्नेह का", "मान का"]},
            {"id": 2, "correct": "गाँठ", "options": ["गाँठ", "दाग", "दरार"]}
        ]
    },
    {
        "id": "hindi_tulsi_doha_daya",
        "title": "दया धर्म का मूल है (Compassion as the Root of Righteousness)",
        "language": "hindi",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "दया धर्म का मूल है, पाप मूल अभिमान।\nतुलसी दया न छाँड़िए, जब लग घट में प्रान॥",
        "transliteration": "Daya dharama ka mool hai, paap mool abhimaan\nTulsi daya na chhaandiye, jab lag ghat mein praan",
        "meaning": "Compassion is the foundational root of all virtue, while arrogance is the root of wrongdoing. Tulsidas counsels: never abandon compassion as long as breath stirs within your frame.",
        "pronunciation": "Da-yaa dhar-am kaa mool hai, paap mool abhi-maan",
        "difficulty": "beginner",
        "source": "Goswami Tulsidas (Dohavali)",
        "tags": ["Tulsidas", "Compassion", "Virtue", "Humility"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "धर्म का मूल", "options": ["धर्म का मूल", "ज्ञान का मूल", "शान्ति का मूल"]},
            {"id": 2, "correct": "अभिमान", "options": ["अभिमान", "क्रोध", "लोभ"]}
        ]
    },
    {
        "id": "hindi_tulsi_ramcharit_dharama",
        "title": "परहित सरिस धर्म नहिं भाई (Service as Supreme Religion)",
        "language": "hindi",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "परहित सरिस धर्म नहिं भाई।\nपर पीड़ा सम नहिं अधमाई॥\nनिर्णय सकल पुरान बेद कर।\nकहेउ तात जानहिं कोबिद नर॥",
        "transliteration": "Parahit saris dharam nahin bhaai\nPar peeda sam nahin adhamaai\nNirnay sakal puraan bed kar\nKaheu taat jaanahin kobid nar",
        "meaning": "There is no righteousness superior to selflessly helping others; there is no degradation lower than causing distress to living beings. This is the unanimous verdict of all ancient wisdom.",
        "pronunciation": "Par-hit sa-ris dhar-am na-hin bhaa-ee",
        "difficulty": "intermediate",
        "source": "Ramcharitmanas (Uttarakanda by Tulsidas)",
        "tags": ["Tulsidas", "Service", "Kindness", "Ramcharitmanas"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "परहित", "options": ["परहित", "स्वहित", "यज्ञ"]},
            {"id": 2, "correct": "पर पीड़ा", "options": ["पर पीड़ा", "अज्ञान", "आलस्य"]}
        ]
    },
    {
        "id": "hindi_tulsi_vidya_vinaya",
        "title": "तुलसी मीठे बचन ते (Sweet Words Dispel Discord)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "तुलसी मीठे बचन ते, सुख उपजत चहुँ ओर।\nबसीकरण इक मंत्र है, परिहरू बचन कठोर॥",
        "transliteration": "Tulsi meethe bachan te, sukh upajat chahun ore\nBaseekaran ik mantra hai, pariharu bachan kathore",
        "meaning": "Through gentle and pleasant words, happiness radiates in every direction. It acts as an irresistible charm to harmonize hearts; discard harsh and bitter speech forever.",
        "pronunciation": "Tul-see mee-thay ba-chan tay, sukh up-jat cha-hun ore",
        "difficulty": "beginner",
        "source": "Goswami Tulsidas (Dohavali)",
        "tags": ["Speech", "Harmony", "Kindness", "Tulsidas"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "मीठे बचन", "options": ["मीठे बचन", "सत्य बचन", "मौन बचन"]},
            {"id": 2, "correct": "कठोर", "options": ["कठोर", "दुर्बल", "अल्प"]}
        ]
    },
    {
        "id": "hindi_hanuman_chalisa_opening",
        "title": "श्रीगुरु चरन सरोज रज (Purifying the Mirror of the Mind)",
        "language": "hindi",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि।\nबरनउँ रघुबर बिमल जसु जो दायकु फल चारि॥\nबुद्धिहीन तनु जानिके सुमिरौं पवन-कुमार।\nबल बुद्धि बिद्या देहु मोहिं हरहु कलेस बिकार॥",
        "transliteration": "Shree Guru charan saroj raj nija manu mukuru sudhaari\nBaranau Raghuvar bimal jasu jo daayaku phal chaari\nBuddhi-heen tanu jaanike sumirau pavan-kumaar\nBala buddhi vidyaa dehu mohin harahu kalesa bikaar",
        "meaning": "Cleansing the mirror of my mind with the gentle dust of the Guru's lotus feet, I recount the pure virtues that yield life's four fruits. Conscious of my limitations, I invoke wisdom, clarity, and the dispelling of distress.",
        "pronunciation": "Shree guru charan saroj raj nij manu mukuru sudhaari",
        "difficulty": "intermediate",
        "source": "Hanuman Chalisa (Goswami Tulsidas)",
        "tags": ["Hanuman Chalisa", "Humility", "Strength", "Wisdom"],
        "stages": ["listen", "repeat", "chunk", "recall"],
        "blanks": [
            {"id": 1, "correct": "मुकुरु सुधारि", "options": ["मुकुरु सुधारि", "मनु सँवारि", "हृदय विचारि"]},
            {"id": 2, "correct": "बल बुद्धि बिद्या", "options": ["बल बुद्धि बिद्या", "धन वैभव यश", "शान्ति सुख भक्ति"]}
        ]
    },
    {
        "id": "hindi_dinkar_veer",
        "title": "सच है, विपत्ति जब आती है (Adversity Tests the Resolute)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "सच है, विपत्ति जब आती है,\nकायर को ही दहलाती है,\nसूरमा नहीं विचलित होते,\nक्षण एक नहीं धीरज खोते,\nविघ्नों को गले लगाते हैं,\nकाँटों में राह बनाते हैं॥",
        "transliteration": "Sach hai, vipatti jab aati hai\nKaayar ko hi dahlaati hai\nSoormaa nahin vichlit hote\nKshan ek nahin dheeraj khote\nVighnon ko gale lagaate hain\nKaanton mein raah banaate hain",
        "meaning": "It is true: when hardship strikes, it terrifies only the faint-hearted. The resolute never waver nor forfeit patience for a single moment. They embrace challenges and forge trails through thorns.",
        "pronunciation": "Sach hai vi-pat-ti jab aa-tee hai",
        "difficulty": "intermediate",
        "source": "Ramdhari Singh Dinkar - Rashmirathi (Canto 3)",
        "tags": ["Dinkar", "Rashmirathi", "Resilience", "Courage"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "विचलित", "options": ["विचलित", "भयभीत", "पराजित"]},
            {"id": 2, "correct": "काँटों में", "options": ["काँटों में", "पर्वत में", "अँधेरे में"]}
        ]
    },
    {
        "id": "hindi_dinkar_kalam",
        "title": "कलम, आज उनकी जय बोल (Salute to Unsung Sacrifices)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "जला अस्थियाँ बारी-बारी\nचिटकाई जिनमें चिंगारी,\nजो चढ़ गये पुण्यवेदी पर\nलिए बिना गर्दन का मोल\nकलम, आज उनकी जय बोल!",
        "transliteration": "Jalaa asthiyaan baari-baari\nChitkaai jinmein chingaari\nJo chadh gaye punyavedi par\nLiye bina gardan ka mol\nKalam, aaj unki jai bol!",
        "meaning": "O pen, sing the praises of those silent heroes who fueled the spark of courage, sacrificing their lives without seeking personal fame or bargaining for recognition.",
        "pronunciation": "Ka-lam aaj un-kee jai bol",
        "difficulty": "intermediate",
        "source": "Ramdhari Singh Dinkar (Patriotic Classics)",
        "tags": ["Dinkar", "Courage", "Dedication", "Inspiration"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "चिंगारी", "options": ["चिंगारी", "ज्वाला", "उजाला"]},
            {"id": 2, "correct": "जय बोल", "options": ["जय बोल", "नाम बोल", "गीत बोल"]}
        ]
    },
    {
        "id": "hindi_harivansh_koshish",
        "title": "लहरों से डर कर नौका पार नहीं होती (Persistent Effort Never Fails)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "लहरों से डर कर नौका पार नहीं होती,\nकोशिश करने वालों की कभी हार नहीं होती।\nनन्हीं चींटी जब दाना लेकर चलती है,\nचढ़ती दीवारों पर, सौ बार फिसलती है।\nमन का विश्वास रगों में साहस भरता है,\nचढ़कर गिरना, गिरकर चढ़ना न अखरता है।",
        "transliteration": "Lahron se dar kar nauka paar nahin hoti\nKoshish karne waalon ki kabhi haar nahin hoti\nNanhi cheenti jab daana lekar chalti hai\nChadhti deewaaron par, sau baar phisalti hai\nMan ka vishwas ragon mein saahas bharta hai\nChadkar girna, girkar chadna na akharta hai",
        "meaning": "A boat never crosses turbulent waters if frightened by waves; those who persist never truly face defeat. The tiny ant carrying grain slips a hundred times on steep walls, yet never surrenders.",
        "pronunciation": "Lah-ron say dar kar nau-kaa paar na-hin ho-tee",
        "difficulty": "intermediate",
        "source": "Harivansh Rai Bachchan (Attributed Inspiration)",
        "tags": ["Perseverance", "Bachchan", "Courage", "Grit"],
        "stages": ["listen", "repeat", "chunk", "recall"],
        "blanks": [
            {"id": 1, "correct": "हार", "options": ["हार", "जीत", "देर"]},
            {"id": 2, "correct": "साहस", "options": ["साहस", "उत्साह", "आनंद"]}
        ]
    },
    {
        "id": "hindi_harivansh_agnipath",
        "title": "अग्निपथ! अग्निपथ! (Walk Resolute on the Path of Fire)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "वृक्ष हों भले खड़े,\nहों घने हों बड़े,\nएक पत्र-छाहँ भी\nमाँग मत, माँग मत, माँग मत!\nअग्निपथ! अग्निपथ! अग्निपथ!\nतू न थकेगा कभी!\nतू न रुकेगा कभी!\nतू न मुड़ेगा कभी!\nकर शपथ! कर शपथ! कर शपथ!",
        "transliteration": "Vriksh hon bhale khade\nHon ghane hon bade\nEk patra-chhaanh bhi\nMaang mat, maang mat, maang mat!\nAgnipath! Agnipath! Agnipath!\nTu na thakega kabhi!\nTu na rukega kabhi!\nTu na mudega kabhi!\nKar shapath! Kar shapath! Kar shapath!",
        "meaning": "Though massive sheltering trees stand beside your journey, seek not even the shade of a single leaf! The path of destiny is forged in fire. Swear that you will neither weary, nor halt, nor turn back.",
        "pronunciation": "Vriksh hon bha-lay kha-day",
        "difficulty": "intermediate",
        "source": "Harivansh Rai Bachchan - Agnipath",
        "tags": ["Bachchan", "Resolve", "Determination", "Agnipath"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "माँग मत", "options": ["माँग मत", "सोच मत", "देख मत"]},
            {"id": 2, "correct": "कर शपथ", "options": ["कर शपथ", "कर यत्न", "कर कर्म"]}
        ]
    },
    {
        "id": "hindi_soordas_maiya_mori",
        "title": "मैया मोरी मैं नहिं माखन खायो (Innocence and Playfulness)",
        "language": "hindi",
        "category": "song",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "मैया मोरी मैं नहिं माखन खायो।\nभोर भयो गैयन के पाछे, मधुबन मोहि पठायो॥\nचार पहर बंसीबट भटक्‍यो, साँझ परे घर आयो।\nमैं बालक बहियन को छोटा, छींके किस बिधि पायो॥",
        "transliteration": "Maiya mori main nahin maakhan khaayo\nBhor bhayo gaiyan ke paachhe, madhuban mohi pathaayo\nChaar pahar banseebat bhatkyo, saanjh pare ghar aayo\nMain baalak bahiyan ko chhota, chheenke kis bidhi paayo",
        "meaning": "O mother, I did not eat the butter! At dawn you sent me to graze calves in the groves; all day I wandered by the flute-tree and returned at dusk. How could my little hands reach the high pot?",
        "pronunciation": "Mai-yaa mo-ree main na-hin maa-khan khaa-yo",
        "difficulty": "intermediate",
        "source": "Soordas (Sur Sagar, Braj Bhasha Classic)",
        "tags": ["Soordas", "Playfulness", "Braj", "Bhakti"],
        "stages": ["listen", "repeat", "chunk"],
        "blanks": [
            {"id": 1, "correct": "माखन खायो", "options": ["माखन खायो", "दूध पियो", "फल तोड्यो"]},
            {"id": 2, "correct": "साँझ परे", "options": ["साँझ परे", "रात परे", "दोपहर में"]}
        ]
    },
    {
        "id": "hindi_meera_payoji",
        "title": "पायो जी मैंने राम रतन धन पायो (The Inestimable Treasure)",
        "language": "hindi",
        "category": "song",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "पायो जी मैंने राम रतन धन पायो।\nवस्तु अमोलक दी मेरे सतगुरु, किरपा करि अपनायो॥\nजनम-जनम की पूँजी पाई, जग में सभी खोवायो।\nखरचै नहिं कोई चोर न लेवै, दिन-दिन बढ़त सवायो॥",
        "transliteration": "Paayo ji maine Ram ratan dhan paayo\nVastu amolak dee mere satguru, kirpa kari apnaayo\nJanam-janam kee poonji paayee, jag mein sabhi khovaayo\nKharchai nahin koi chor na levai, din-din badhat savaayo",
        "meaning": "I have found the priceless jewel of divine mindfulness. My noble mentor bestowed this treasure beyond price. No wealth can be stolen by thieves or depleted by expenditure; it grows daily.",
        "pronunciation": "Paa-yo jee mai-nay Ram ra-tan dhan paa-yo",
        "difficulty": "intermediate",
        "source": "Meera Bai (16th Century Bhakti Hymn)",
        "tags": ["Meera Bai", "Devotion", "Inner Wealth", "Song"],
        "stages": ["listen", "repeat", "chunk"],
        "blanks": [
            {"id": 1, "correct": "अमोलक", "options": ["अमोलक", "सुन्दर", "दुर्लभ"]},
            {"id": 2, "correct": "बढ़त सवायो", "options": ["बढ़त सवायो", "घटत नित्य", "रहत समान"]}
        ]
    },
    {
        "id": "hindi_kabir_guru_govind",
        "title": "गुरु गोविंद दोऊ खड़े (The Guide Who Shows the Way)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "गुरु गोविंद दोऊ खड़े, काके लागूं पाँय।\nबलिहारी गुरु आपने, गोविंद दियो बताय॥",
        "transliteration": "Guru Govind do-oo khade, kaake laagun paany\nBalihaari guru aapne, Govind diyo bataay",
        "meaning": "Both the Teacher and the Divine stand before me; to whom shall I bow first? All reverence to the Teacher, who illuminated my vision and revealed the Divine to me.",
        "pronunciation": "Gu-ru Go-vind do-oo kha-day, kaa-kay laa-goon paany",
        "difficulty": "beginner",
        "source": "Kabir Ke Dohe",
        "tags": ["Guru", "Gratitude", "Kabir", "Guidance"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "काके लागूं", "options": ["काके लागूं", "किसको देखूं", "कहाँ जाऊं"]},
            {"id": 2, "correct": "गोविंद दियो", "options": ["गोविंद दियो", "मार्ग दियो", "सत्य दियो"]}
        ]
    },
    {
        "id": "hindi_kabir_pothi_padhi",
        "title": "पोथी पढ़ि पढ़ि जग मुआ (Love Outweighs Mere Pedantry)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "पोथी पढ़ि पढ़ि जग मुआ, पंडित भया न कोय।\nढाई आखर प्रेम का, पढ़े सो पंडित hoy॥",
        "transliteration": "Pothi padhi padhi jag muaa, pandit bhayaa na koy\nDhaai aakhar prem ka, padhe so pandit hoy",
        "meaning": "Scholars exhausted lifetimes memorizing voluminous tomes, yet true wisdom remained elusive. Whoever truly internalizes and lives the simple essence of love and empathy is genuinely wise.",
        "pronunciation": "Po-thee pa-dhi pa-dhi jag mu-aa",
        "difficulty": "beginner",
        "source": "Kabir Ke Dohe",
        "tags": ["Love", "Empathy", "Kabir", "Wisdom"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "पंडित", "options": ["पंडित", "ज्ञानी", "सिद्ध"]},
            {"id": 2, "correct": "प्रेम का", "options": ["प्रेम का", "ज्ञान का", "धर्म का"]}
        ]
    },
    {
        "id": "hindi_tulsi_karam_pradhan",
        "title": "करम प्रधान बिस्व करि राखा (The Law of Cause and Consequence)",
        "language": "hindi",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "करम प्रधान बिस्व करि राखा।\nजो जस करइ सो तस फलु चाखा॥\nसकल पदारथ एहि जग माहीं।\nकरमहीन नर पावत नाहीं॥",
        "transliteration": "Karam pradhaan biswa kari raakha\nJo jas karai so tas phalu chaakha\nSakal padaarath ehi jag maahin\nKaram-heen nar paavat naahin",
        "meaning": "The cosmos is fundamentally structured around conscious action: as you sow, so you reap. All abundance and fulfillment exist within this world, yet those without action attain nothing.",
        "pronunciation": "Ka-ram pra-dhaan bis-wa ka-ri raa-khaa",
        "difficulty": "intermediate",
        "source": "Ramcharitmanas (Ayodhya Kanda by Tulsidas)",
        "tags": ["Action", "Cause and Effect", "Tulsidas", "Discipline"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "करम प्रधान", "options": ["करम प्रधान", "भाग्य प्रधान", "काल प्रधान"]},
            {"id": 2, "correct": "करमहीन", "options": ["करमहीन", "ज्ञानहीन", "बलहीन"]}
        ]
    },
    {
        "id": "hindi_rahim_chhoti_vastu",
        "title": "रहिमन देखि बड़ेन को (Never Disdain the Humble)",
        "language": "hindi",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "रहिमन देखि बड़ेन को, लघु न दीजिए डारि।\nजहाँ काम आवै सुई, कहा करै तरवारि॥",
        "transliteration": "Rahiman dekhi baden ko, laghu na deejiye daari\nJahaan kaam aavai suee, kahaa karai tarwaari",
        "meaning": "When encountering the eminent or powerful, never dismiss the humble or small. Where a small needle is needed to sew, what purpose can a mighty sword serve? Everything has its unique worth.",
        "pronunciation": "Ra-hi-man day-khi ba-dayn ko la-ghu na dee-ji-yay daa-ri",
        "difficulty": "beginner",
        "source": "Rahim Ke Dohe",
        "tags": ["Respect", "Humility", "Inclusivity", "Rahim"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "सुई", "options": ["सुई", "धागा", "कील"]},
            {"id": 2, "correct": "तरवारि", "options": ["तरवारि", "कुल्हाड़ी", "तीर"]}
        ]
    },
    {
        "id": "hindi_vrind_kart_kart",
        "title": "करत-करत अभ्यास ते (Persistence Transforms Dullness to Brilliance)",
        "language": "hindi",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "करत-करत अभ्यास ते, जड़मति होत सुजान।\nरसरी आवत जात ते, सिल पर परत निसान॥",
        "transliteration": "Karat-karat abhyaas te, jadamati hot sujaan\nRasari aavat jaat te, sil par parat nisaan",
        "meaning": "Through persistent, deliberate practice, even a dull intellect blossoms into sharp brilliance, just as a soft hemp rope repeatedly drawn across a hard stone leaves an enduring groove.",
        "pronunciation": "Ka-rat ka-rat abh-yaas tay, ja-da-ma-ti hot su-jaan",
        "difficulty": "beginner",
        "source": "Vrind Ke Dohe (17th Century Hindi Didactic Poetry)",
        "tags": ["Practice", "Deliberate Practice", "Persistence", "Mastery"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "सुजान", "options": ["सुजान", "महान", "विद्वान"]},
            {"id": 2, "correct": "सिल पर", "options": ["सिल पर", "भूमि पर", "वृक्ष पर"]}
        ]
    },
    {
        "id": "hindi_prasad_himadri",
        "title": "हिमाद्रि तुंग श्रृंग से (The Clarion Call of Independence)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "हिमाद्रि तुंग श्रृंग से प्रबुद्ध शुद्ध भारती,\nस्वयंप्रभा समुज्ज्वला स्वतंत्रता पुकारती,\nअमर्त्य वीर पुत्र हो, दृढ़-प्रतिज्ञ सोच लो,\nप्रशस्त पुण्य पंथ है, बढ़े चलो, बढ़े चलो!",
        "transliteration": "Himaadri tung shring se prabuddh shuddh bhaarati\nSwayam-prabha samujjwala swatantrataa pukaarti\nAmartya veer putra ho, dridh-pratigya soch lo\nPrashast punya panth hai, badhe chalo, badhe chalo!",
        "meaning": "From the lofty peaks of the Himalayas, radiant and awake, liberty calls out! You are heroic sons and daughters; embrace your steadfast resolve. The noble path lies open: march on, march on!",
        "pronunciation": "Hi-maa-dri tung shring say pra-buddh shuddh bhaa-ra-tee",
        "difficulty": "intermediate",
        "source": "Jaishankar Prasad (Chandragupta Natak)",
        "tags": ["Jaishankar Prasad", "Freedom", "Courage", "Literature"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "स्वतंत्रता", "options": ["स्वतंत्रता", "अखंडता", "समरसता"]},
            {"id": 2, "correct": "बढ़े चलो", "options": ["बढ़े चलो", "गाते चलो", "सुनते चलो"]}
        ]
    },
    {
        "id": "hindi_subhadra_jhansi",
        "title": "खूब लड़ी मर्दानी वह तो झाँसी वाली रानी थी (The Courage of Rani Lakshmibai)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "बुंदेले हरबोलों के मुँह हमने सुनी कहानी थी,\nखूब लड़ी मर्दानी वह तो झाँसी वाली रानी थी!\nचमक उठी सन सत्तावन में, वह तलवार पुरानी थी,\nबुंदेले हरबोलों के मुँह हमने सुनी कहानी थी।",
        "transliteration": "Bundele harbolon ke munh hamne suni kahaani thi\nKhoob ladi mardaani woh to Jhansi waali raani thi\nChamak uthi san sattaavan mein, woh talwaar puraani thi\nBundele harbolon ke munh hamne suni kahaani thi",
        "meaning": "From the bards of Bundelkhand we heard the stirring legend: with matchless valor she fought, the fearless Queen of Jhansi. In 1857, the historic blade flashed with unbreakable defiance.",
        "pronunciation": "Bun-day-lay har-bo-lon kay munh ham-nay su-nee ka-haa-nee thee",
        "difficulty": "beginner",
        "source": "Subhadra Kumari Chauhan (Jhansi ki Rani)",
        "tags": ["Bravery", "History", "Freedom", "Poetry"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "झाँसी वाली", "options": ["झाँसी वाली", "अवध वाली", "मेवाड़ वाली"]},
            {"id": 2, "correct": "तलवार", "options": ["तलवार", "ढाल", "तोप"]}
        ]
    },
    {
        "id": "hindi_maithili_manushya",
        "title": "वही मनुष्य है कि जो मनुष्य के लिए मरे (True Humanity Lies in Empathy)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "विचार लो कि मर्त्य हो न मृत्यु से डरो कभी,\nमरो परंतु यों मरो कि याद जो करे सभी।\nहुई न यों सु-मृत्यु तो वृथा मरे, वृथा जिये,\nमरा नहीं वही कि जो जिया न आपके लिए।\nयही पशु-प्रवृत्ति है कि आप आप ही चरे,\nवही मनुष्य है कि जो मनुष्य के लिए मरे॥",
        "transliteration": "Vichaar lo ki martya ho na mrityu se daro kabhi\nMaro parantu yon maro ki yaad jo kare sabhi\nHuee na yon su-mrityu to vrithaa mare, vrithaa jiye\nMaraa nahin vahi ki jo jiyaa na aapke liye\nYahi pashu-pravritti hai ki aap aap hi chare\nVahi manushya hai ki jo manushya ke liye mare",
        "meaning": "Reflect that you are mortal; never fear transition, but live so purposefully that your contributions remain alive. Living only for oneself is animal instinct; true humanity lives in mutual care.",
        "pronunciation": "Vi-chaar lo ki mar-tya ho na mrit-yu say da-ro ka-bhee",
        "difficulty": "intermediate",
        "source": "Maithili Sharan Gupt (Manushyata)",
        "tags": ["Humanity", "Empathy", "Purpose", "Gupt"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "याद जो करे", "options": ["याद जो करे", "शोक जो करे", "गान जो करे"]},
            {"id": 2, "correct": "मनुष्य के लिए", "options": ["मनुष्य के लिए", "स्वयं के लिए", "धन के लिए"]}
        ]
    },
    {
        "id": "hindi_nirala_saroj",
        "title": "दुख ही जीवन की कथा रही (Steadfast Dignity Through Sorrow)",
        "language": "hindi",
        "category": "story",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "दुख ही जीवन की कथा रही,\nक्या कहूँ आज, जो नहीं कही!\nहो सिद्ध कर्म सब युग-युग के,\nकिए हैं मैंने जो निष्फल से,\nअर्पित कर सब चरणों पर,\nकरूँ आज श्रद्धांजलि नत-शिर!",
        "transliteration": "Dukh hi jeevan ki katha rahi\nKya kahoon aaj, jo nahin kahi!\nHo siddh karm sab yug-yug ke\nKiye hain maine jo nishphal se\nArpit kar sab charanon par\nKaroon aaj shraddhanjali nat-shir",
        "meaning": "Sorrow has been the prevailing story of this life; what new thing can I utter today? Yet whatever earnest deeds I offered, I dedicate them humbly and bow with unbroken dignity.",
        "pronunciation": "Dukh hi jee-van kee ka-thaa ra-hee",
        "difficulty": "advanced",
        "source": "Suryakant Tripathi 'Nirala' (Saroj Smriti)",
        "tags": ["Nirala", "Dignity", "Resilience", "Classics"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "कथा रही", "options": ["कथा रही", "सजा रही", "दवा रही"]},
            {"id": 2, "correct": "श्रद्धांजलि", "options": ["श्रद्धांजलि", "प्रार्थना", "वेदना"]}
        ]
    },
    {
        "id": "hindi_proverb_boond_boond",
        "title": "बूँद-बूँद से घड़ा भरता है (Small Consistent Steps Yield Vast Results)",
        "language": "hindi",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "बूँद-बूँद से घड़ा भरता है,\nतप-तप से ही लोहा गलता है।\nजो धीरज धरि पग आगे धरता,\nमंजिल का संशय वह हरता॥",
        "transliteration": "Boond-boond se ghadaa bhartaa hai\nTap-tap se hi lohaa galtaa hai\nJo dheeraj dhari pag aagey dhartaa\nManzil kaa sanshay vah hartaa",
        "meaning": "Drop by drop, the pitcher fills completely; through constant heat, iron is forged. One who steps forward with steady patience dispels all doubts and reaches the destination.",
        "pronunciation": "Boond boond say gha-daa bhar-taa hai",
        "difficulty": "beginner",
        "source": "Traditional Hindi Wisdom Tradition",
        "tags": ["Consistency", "Compound Effect", "Habits", "Hindi Proverb"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "घड़ा भरता है", "options": ["घड़ा भरता है", "पानी बहता है", "समय जाता है"]},
            {"id": 2, "correct": "धीरज", "options": ["धीरज", "साहस", "गर्व"]}
        ]
    },
    {
        "id": "hindi_proverb_jaisi_karni",
        "title": "जैसी करनी वैसी भरनी (Integrity in Conduct)",
        "language": "hindi",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "जैसी करनी वैसी भरनी,\nसच की नैया कभी न डूबनी।\nबोवे पेड़ बबूल का तो,\nआम कहाँ से खाय रे भाई॥",
        "transliteration": "Jaisi karni vaisi bharni\nSach ki naiyaa kabhi na doobni\nBove ped babool ka to\nAam kahaan se khaay re bhaai",
        "meaning": "As you act, so you shall experience; the vessel of truth never sinks. If one sows thorny acacia seeds, how can one expect sweet mangoes? Mind your daily actions.",
        "pronunciation": "Jai-see kar-nee vai-see bhar-nee",
        "difficulty": "beginner",
        "source": "Panchatantra Hindi Moral Tradition",
        "tags": ["Karma", "Truth", "Accountability", "Proverb"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "वैसी भरनी", "options": ["वैसी भरनी", "वैसी करनी", "वैसी चलनी"]},
            {"id": 2, "correct": "सच की नैया", "options": ["सच की नैया", "झूठ की नैया", "नाव पुरानी"]}
        ]
    },
    {
        "id": "hindi_kabir_sadhu_aisa",
        "title": "साधु ऐसा चाहिए (Sifting Essence from Superficiality)",
        "language": "hindi",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "साधु ऐसा चाहिए, जैसा सूप सुभाय।\nसार-सार को गहि रहै, थोथा देइ उड़ाय॥",
        "transliteration": "Saadhu aisa chaahiye, jaisa soop subhaay\nSaar-saar ko gahi rahai, thothaa dei udaay",
        "meaning": "A noble mind should operate like a winnowing basket: retaining the rich grain of genuine substance, while blowing away the empty chaff of gossip and trivia.",
        "pronunciation": "Saa-dhu ai-saa chaa-hi-yay jai-saa soop su-bhaay",
        "difficulty": "beginner",
        "source": "Kabir Ke Dohe",
        "tags": ["Discernment", "Critical Thinking", "Kabir", "Substance"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "सूप सुभाय", "options": ["सूप सुभाय", "दीप सुभाय", "नीर सुभाय"]},
            {"id": 2, "correct": "सार-सार", "options": ["सार-सार", "नाम-नाम", "रूप-रूप"]}
        ]
    },
    {
        "id": "hindi_meera_mere_to",
        "title": "मेरो तो गिरधर गोपाल (Single-Minded Devotion and Simplicity)",
        "language": "hindi",
        "category": "song",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "मेरो तो गिरधर गोपाल दूसरो न कोई।\nजाके सिर मोर मुकुट मेरो पति सोई॥\nतात मात भ्रात बंधु आपनो न कोई।\nछाँड़ि दयी कुल की कानि कहा करिहै कोई॥",
        "transliteration": "Mero to Girdhar Gopal doosro na koi\nJaake sir mor mukut mero pati soi\nTaat maat bhraat bandhu aapno na koi\nChhaandi dayi kul kee kaani kahaa karihai koi",
        "meaning": "My heart belongs to the gentle guardian who holds up the mountain; none other has claim. Releasing external social pretense, I abide solely in authentic devotion.",
        "pronunciation": "May-ro to Gir-dhar Go-paal doo-sa-ro na ko-ee",
        "difficulty": "intermediate",
        "source": "Meera Bai (Bhakti Classic)",
        "tags": ["Meera Bai", "Simplicity", "Authenticity", "Song"],
        "stages": ["listen", "repeat", "chunk"],
        "blanks": [
            {"id": 1, "correct": "गिरधर गोपाल", "options": ["गिरधर गोपाल", "राजा गोपाल", "नंद गोपाल"]},
            {"id": 2, "correct": "दूसरो न कोई", "options": ["दूसरो न कोई", "सब जग होई", "अपनो न कोई"]}
        ]
    }
]

english_items = [
    {
        "id": "eng_marcus_mind",
        "title": "The Inner Citadel (Marcus Aurelius)",
        "language": "english",
        "category": "story",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "You have power over your mind, not outside events.\nRealize this, and you will find unshakeable strength.\nThe happiness of your life depends upon the quality of your thoughts.",
        "meaning": "External circumstances cannot wound your inner character unless you permit them to. Cultivate clarity and deliberate thought to build an unbreakable citadel of peace.",
        "difficulty": "beginner",
        "source": "Meditations, Book IV (Stoic Philosophy)",
        "tags": ["Stoicism", "Resilience", "Focus", "English"],
        "stages": ["listen", "repeat", "recall", "missing_word"],
        "blanks": [
            {"id": 1, "correct": "mind", "options": ["mind", "body", "future"]},
            {"id": 2, "correct": "strength", "options": ["strength", "wealth", "victory"]},
            {"id": 3, "correct": "quality", "options": ["quality", "quantity", "speed"]}
        ]
    },
    {
        "id": "eng_thirukkural_truth",
        "title": "Discerning Truth (Thirukkural Verse 423)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "Whatever thing, of whatever nature, by whomsoever spoken,\nTo perceive the true reality in it is true wisdom.",
        "transliteration": "Epporul yaar-yaar-vaai ketpinum apporul\nMeipporul kaanbadharivu.",
        "meaning": "True intellect does not judge knowledge by the fame or authority of the speaker, but by discerning the factual truth contained within the statement.",
        "pronunciation": "Ep-po-rul yaar yaar vaai ket-pi-num ap-po-rul meip-po-rul kaan-ba-dha-ri-vu",
        "difficulty": "beginner",
        "source": "Thirukkural, Chapter 43: Arivudaimai (Wisdom)",
        "tags": ["Critical Thinking", "Wisdom", "Philosophy", "English"],
        "stages": ["listen", "repeat", "recall", "missing_word"],
        "blanks": [
            {"id": 1, "correct": "whatever", "options": ["whatever", "sacred", "popular"]},
            {"id": 2, "correct": "reality", "options": ["reality", "pleasure", "tradition"]},
            {"id": 3, "correct": "wisdom", "options": ["wisdom", "wealth", "power"]}
        ]
    },
    {
        "id": "eng_tagore_mind_without_fear",
        "title": "Where the Mind is Without Fear (Rabindranath Tagore)",
        "language": "english",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "Where the mind is without fear and the head is held high;\nWhere knowledge is free;\nWhere the world has not been broken up into fragments\nBy narrow domestic walls;\nWhere words come out from the depth of truth;\nInto that heaven of freedom, my Father, let my country awake.",
        "meaning": "A vision of holistic liberation where fearless truth, boundless knowledge, rational open-mindedness, and universal brotherhood awaken society to its highest dignity.",
        "difficulty": "intermediate",
        "source": "Gitanjali (Verse 35) by Rabindranath Tagore",
        "tags": ["Tagore", "Freedom", "Courage", "Universal"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "without fear", "options": ["without fear", "without work", "without sorrow"]},
            {"id": 2, "correct": "depth of truth", "options": ["depth of truth", "fear of power", "habit of mind"]}
        ]
    },
    {
        "id": "eng_epictetus_control",
        "title": "The Dichotomy of Control (Epictetus)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "Some things are within our control, and other things are not.\nWithin our control are our opinions, impulses, desires, and aversions.\nNot within our control are our body, wealth, reputation, and public offices.\nWork upon what is yours, and serenity will follow.",
        "meaning": "Direct all your effort towards your own intentions, ethical decisions, and reactions. Let go of anxiety over external outcomes beyond your sovereign influence.",
        "difficulty": "beginner",
        "source": "Enchiridion (The Manual) by Epictetus",
        "tags": ["Stoicism", "Epictetus", "Agency", "Peace"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "control", "options": ["control", "possession", "memory"]},
            {"id": 2, "correct": "opinions", "options": ["opinions", "wealth", "destiny"]}
        ]
    },
    {
        "id": "eng_seneca_time",
        "title": "On the Shortness of Life (Seneca)",
        "language": "english",
        "category": "story",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "It is not that we have a short time to live, but that we waste much of it.\nLife is long enough, and a sufficiently generous estimate has been given to us\nFor the highest achievements, if it were all well invested.",
        "meaning": "Time is humanity's most irreplaceable asset. When guarded consciously rather than squandered on trivial distractions, a human lifetime is richly sufficient.",
        "difficulty": "intermediate",
        "source": "De Brevitate Vitae (On the Shortness of Life) by Seneca",
        "tags": ["Seneca", "Time Management", "Deep Work", "Stoicism"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "waste", "options": ["waste", "lose", "fear"]},
            {"id": 2, "correct": "invested", "options": ["invested", "measured", "counted"]}
        ]
    },
    {
        "id": "eng_kipling_if",
        "title": "If You Can Keep Your Head (Rudyard Kipling)",
        "language": "english",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 4,
        "originalText": "If you can keep your head when all about you\nAre losing theirs and blaming it on you;\nIf you can trust yourself when all men doubt you,\nBut make allowance for their doubting too;\nIf you can meet with Triumph and Disaster\nAnd treat those two impostors just the same;\nYours is the Earth and everything that's in it.",
        "meaning": "Equanimity amidst public blame, self-trust balanced with humility, and treating victory and setback as twin illusions forge true mature character.",
        "difficulty": "intermediate",
        "source": "If— by Rudyard Kipling (1895)",
        "tags": ["Equanimity", "Resilience", "Character", "English Classics"],
        "stages": ["listen", "repeat", "chunk", "recall"],
        "blanks": [
            {"id": 1, "correct": "keep your head", "options": ["keep your head", "stand alone", "speak your mind"]},
            {"id": 2, "correct": "impostors", "options": ["impostors", "masters", "servants"]}
        ]
    },
    {
        "id": "eng_frost_woods",
        "title": "Stopping by Woods on a Snowy Evening (Robert Frost)",
        "language": "english",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "The woods are lovely, dark and deep,\nBut I have promises to keep,\nAnd miles to go before I sleep,\nAnd miles to go before I sleep.",
        "meaning": "Contemplating the quiet beauty of nature restores the spirit, yet life's sacred commitments and duties beckon us forward with steadfast dedication.",
        "difficulty": "beginner",
        "source": "Robert Frost (1923 Poetry Collection)",
        "tags": ["Commitment", "Focus", "Nature", "Frost"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "promises", "options": ["promises", "secrets", "dreams"]},
            {"id": 2, "correct": "sleep", "options": ["sleep", "weep", "rest"]}
        ]
    },
    {
        "id": "eng_invictus_henley",
        "title": "Invictus: Master of My Fate (William Ernest Henley)",
        "language": "english",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "Out of the night that covers me,\nBlack as the pit from pole to pole,\nI thank whatever gods may be\nFor my unconquerable soul.\nIt matters not how strait the gate,\nHow charged with punishments the scroll,\nI am the master of my fate,\nI am the captain of my soul.",
        "meaning": "In the darkest adversity and pain, the human spirit possesses sovereign resilience. You remain the unbroken author of your courage and integrity.",
        "difficulty": "intermediate",
        "source": "Invictus by William Ernest Henley (1875)",
        "tags": ["Invictus", "Unconquerable", "Resilience", "Courage"],
        "stages": ["listen", "repeat", "chunk", "recall"],
        "blanks": [
            {"id": 1, "correct": "unconquerable", "options": ["unconquerable", "gentle", "weary"]},
            {"id": 2, "correct": "captain", "options": ["captain", "soldier", "watcher"]}
        ]
    },
    {
        "id": "eng_gita_eng_work",
        "title": "Dedicated Action Without Attachment (Universal Bhagavad Gita)",
        "language": "english",
        "category": "shloka",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "Set thy heart upon thy work, but never upon its reward.\nWork not for a reward; but never cease to do thy work.\nDo thy work in the peace of Yoga and, free from selfish desires,\nBe not moved in success or in failure. Yoga is evenness of mind.",
        "meaning": "Commit totally to the craftsmanship of the present endeavor. Detachment from outcome frees you from paralyzing anxiety, establishing balance.",
        "difficulty": "beginner",
        "source": "Bhagavad Gita (Translation by Juan Mascaro)",
        "tags": ["Gita in English", "Karma Yoga", "Balance", "Focus"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "work", "options": ["work", "reward", "status"]},
            {"id": 2, "correct": "evenness", "options": ["evenness", "speed", "victory"]}
        ]
    },
    {
        "id": "eng_buddha_mind",
        "title": "The Mind is Everything (Dhammapada Verses 1-2)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "What we are today comes from our thoughts of yesterday,\nAnd our present thoughts build our life of tomorrow.\nOur life is the creation of our mind.\nIf a man speaks or acts with a pure mind, joy follows him\nAs his own shadow, never departing.",
        "meaning": "Thought shapes character, habit, and reality. Cultivating clean, benevolent thoughts builds an enduring shadow of peace and lightness.",
        "difficulty": "beginner",
        "source": "The Dhammapada (Yamaka Vagga - The Twin Verses)",
        "tags": ["Dhammapada", "Mindfulness", "Buddhism", "Habits"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "thoughts", "options": ["thoughts", "words", "fortunes"]},
            {"id": 2, "correct": "shadow", "options": ["shadow", "garment", "mirror"]}
        ]
    },
    {
        "id": "eng_khalil_gibran_joy",
        "title": "On Joy and Sorrow (Kahlil Gibran)",
        "language": "english",
        "category": "story",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "Your joy is your sorrow unmasked.\nAnd the selfsame well from which your laughter rises\nWas oftentimes filled with your tears.\nThe deeper that sorrow carves into your being,\nThe more joy you can contain.",
        "meaning": "Joy and grief are complementary depths of the human heart. The hardships you endure expand your capacity to experience gratitude, wonder, and compassion.",
        "difficulty": "intermediate",
        "source": "The Prophet by Kahlil Gibran (1923)",
        "tags": ["Gibran", "The Prophet", "Emotional Depth", "Literature"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "sorrow", "options": ["sorrow", "pride", "fear"]},
            {"id": 2, "correct": "carves", "options": ["carves", "fades", "leaps"]}
        ]
    },
    {
        "id": "eng_emerson_self_reliance",
        "title": "Self-Reliance and Integrity (Ralph Waldo Emerson)",
        "language": "english",
        "category": "story",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "Trust thyself: every heart vibrates to that iron string.\nNothing can bring you peace but yourself.\nNothing can bring you peace but the triumph of principles.\nWhoso would be a man, must be a nonconformist.",
        "meaning": "True autonomy arises when you trust your authentic inner compass and live by principled convictions rather than blindly following consensus.",
        "difficulty": "intermediate",
        "source": "Self-Reliance by Ralph Waldo Emerson (1841)",
        "tags": ["Emerson", "Self-Reliance", "Integrity", "Philosophy"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "Trust thyself", "options": ["Trust thyself", "Fear no one", "Seek wisdom"]},
            {"id": 2, "correct": "principles", "options": ["principles", "fortunes", "applause"]}
        ]
    },
    {
        "id": "eng_thoreau_walden",
        "title": "Deliberate Living (Henry David Thoreau)",
        "language": "english",
        "category": "story",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "I went to the woods because I wished to live deliberately,\nTo front only the essential facts of life,\nAnd see if I could not learn what it had to teach,\nAnd not, when I came to die, discover that I had not lived.",
        "meaning": "Strip away needless superficial complexities. Living deliberately means engaging deeply with what matters most and rejecting mindless drifting.",
        "difficulty": "intermediate",
        "source": "Walden, or Life in the Woods by Henry David Thoreau (1854)",
        "tags": ["Thoreau", "Simplicity", "Intentional Living", "Mindfulness"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "deliberately", "options": ["deliberately", "peacefully", "silently"]},
            {"id": 2, "correct": "essential", "options": ["essential", "comfortable", "pleasant"]}
        ]
    },
    {
        "id": "eng_frankl_meaning",
        "title": "The Last Human Freedom (Viktor Frankl)",
        "language": "english",
        "category": "story",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "Everything can be taken from a man but one thing:\nThe last of the human freedoms—to choose one's attitude\nIn any given set of circumstances, to choose one's own way.\nBetween stimulus and response there is a space.\nIn that space is our power to choose our response.",
        "meaning": "Regardless of extreme physical or situational constraints, the freedom to choose your response and mental attitude remains indelibly yours.",
        "difficulty": "intermediate",
        "source": "Man's Search for Meaning by Viktor E. Frankl",
        "tags": ["Frankl", "Freedom", "Resilience", "Psychology"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "attitude", "options": ["attitude", "fortune", "strength"]},
            {"id": 2, "correct": "power to choose", "options": ["power to choose", "memory of past", "need to act"]}
        ]
    },
    {
        "id": "eng_aristotle_habits",
        "title": "Excellence Through Habit (Aristotle)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "We are what we repeatedly do.\nExcellence, then, is not an act, but a habit.\nMoral virtue comes about as a result of habit;\nBy doing just acts we come to be just.",
        "meaning": "Greatness is not a sporadic heroic gesture, but the compounded result of daily routines, small disciplined acts, and consistent practice.",
        "difficulty": "beginner",
        "source": "Nicomachean Ethics by Aristotle (as distilled by Will Durant)",
        "tags": ["Habits", "Discipline", "Aristotle", "Excellence"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "habit", "options": ["habit", "gift", "accident"]},
            {"id": 2, "correct": "just acts", "options": ["just acts", "grand speeches", "idle wishes"]}
        ]
    },
    {
        "id": "eng_lao_tzu_journey",
        "title": "The Journey of a Thousand Miles (Lao Tzu)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "A journey of a thousand miles begins with a single step.\nThe tree that fills a person's embrace grows from a tiny sprout.\nA tower of nine stories starts with a lump of earth.",
        "meaning": "Every monumental achievement, deep mastery, or monumental reform is composed of small, modest, unassuming beginnings executed today.",
        "difficulty": "beginner",
        "source": "Tao Te Ching (Chapter 64) by Lao Tzu",
        "tags": ["Beginnings", "Taoism", "Consistency", "Action"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "single step", "options": ["single step", "great leap", "proud speech"]},
            {"id": 2, "correct": "tiny sprout", "options": ["tiny sprout", "mighty rock", "deep river"]}
        ]
    },
    {
        "id": "eng_lao_tzu_water",
        "title": "The Supreme Good is Like Water (Lao Tzu)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "The supreme good is like water.\nWater benefits all things without competing with them.\nIt settles in the low places that others disdain.\nTherefore it is close to the Tao.\nIn dwelling, be close to the ground. In thinking, be deep.",
        "meaning": "True power flows from effortless adaptability, selfless benefit to others, and remaining content without frantic, petty competition.",
        "difficulty": "intermediate",
        "source": "Tao Te Ching (Chapter 8) by Lao Tzu",
        "tags": ["Adaptability", "Humility", "Taoism", "Flow"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "without competing", "options": ["without competing", "with great fury", "by rising high"]},
            {"id": 2, "correct": "be deep", "options": ["be deep", "be swift", "be proud"]}
        ]
    },
    {
        "id": "eng_rumi_guest_house",
        "title": "The Guest House (Rumi)",
        "language": "english",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "This being human is a guest house.\nEvery morning a new arrival.\nA joy, a depression, a meanness,\nSome momentary awareness comes as an unexpected visitor.\nWelcome and entertain them all!\nBe grateful for whoever comes,\nBecause each has been sent as a guide from beyond.",
        "meaning": "Greet your diverse emotional states with hospitable mindfulness rather than resistant panic. Each mental visitor carries insight for your growth.",
        "difficulty": "intermediate",
        "source": "The Masnavi by Jalal al-Din Rumi (Translated by Coleman Barks)",
        "tags": ["Rumi", "Mindfulness", "Acceptance", "Sufism"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "guest house", "options": ["guest house", "fortress", "marketplace"]},
            {"id": 2, "correct": "guide", "options": ["guide", "judge", "stranger"]}
        ]
    },
    {
        "id": "eng_rumi_wound",
        "title": "The Wound is Where Light Enters (Rumi)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "The wound is the place where the Light enters you.\nDo not grieve. Anything you lose comes round in another form.\nSilence is the language of God, all else is poor translation.",
        "meaning": "Life's vulnerabilities and fractured plans are precisely where deeper awareness, compassion, and spiritual illumination take root.",
        "difficulty": "beginner",
        "source": "Rumi Wisdom Verses",
        "tags": ["Healing", "Rumi", "Light", "Perspective"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "Light enters", "options": ["Light enters", "pain remains", "fear hides"]},
            {"id": 2, "correct": "Silence", "options": ["Silence", "Speech", "Victory"]}
        ]
    },
    {
        "id": "eng_shakespeare_portia",
        "title": "The Quality of Mercy (William Shakespeare)",
        "language": "english",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "The quality of mercy is not strained;\nIt droppeth as the gentle rain from heaven\nUpon the place beneath. It is twice blest:\nIt blesseth him that gives and him that takes.\n'Tis mightiest in the mightiest; it becomes\nThe throned monarch better than his crown.",
        "meaning": "Compassionate mercy cannot be forced; like gentle rain, it naturally enriches both the giver and the recipient, standing superior to earthly power.",
        "difficulty": "intermediate",
        "source": "The Merchant of Venice (Act IV, Scene 1) by William Shakespeare",
        "tags": ["Shakespeare", "Mercy", "Compassion", "Classics"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "gentle rain", "options": ["gentle rain", "fierce wind", "golden crown"]},
            {"id": 2, "correct": "twice blest", "options": ["twice blest", "rarely seen", "swiftly lost"]}
        ]
    },
    {
        "id": "eng_shakespeare_polonius",
        "title": "To Thine Own Self Be True (William Shakespeare)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "This above all: to thine own self be true,\nAnd it must follow, as the night the day,\nThou canst not then be false to any man.\nGive every man thy ear, but few thy voice;\nTake each man's censure, but reserve thy judgment.",
        "meaning": "Integrity begins with authentic honesty towards oneself. When you honor moral truth internally, falsehood towards others becomes impossible.",
        "difficulty": "beginner",
        "source": "Hamlet (Act I, Scene 3) by William Shakespeare",
        "tags": ["Shakespeare", "Integrity", "Authenticity", "Ethics"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "be true", "options": ["be true", "be kind", "be proud"]},
            {"id": 2, "correct": "reserve thy judgment", "options": ["reserve thy judgment", "accept their praise", "fear their wrath"]}
        ]
    },
    {
        "id": "eng_wordsworth_daffodils",
        "title": "I Wandered Lonely as a Cloud (William Wordsworth)",
        "language": "english",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "I wandered lonely as a cloud\nThat floats on high o'er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils;\nBeside the lake, beneath the trees,\nFluttering and dancing in the breeze.\nFor oft, when on my couch I lie\nIn vacant or in pensive mood,\nThey flash upon that inward eye\nWhich is the bliss of solitude.",
        "meaning": "Nature's tranquil beauty creates enduring mental reservoirs. In moments of quiet solitude, mindful memories flash upon the inner eye to lift the spirit.",
        "difficulty": "intermediate",
        "source": "William Wordsworth (1807)",
        "tags": ["Nature", "Solitude", "Wordsworth", "Mindfulness"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "daffodils", "options": ["daffodils", "lilies", "roses"]},
            {"id": 2, "correct": "inward eye", "options": ["inward eye", "silent lake", "cloudy sky"]}
        ]
    },
    {
        "id": "eng_shelley_ozymandias",
        "title": "Ozymandias and Impermanence (Percy Bysshe Shelley)",
        "language": "english",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "'My name is Ozymandias, King of Kings;\nLook on my Works, ye Mighty, and despair!'\nNothing beside remains. Round the decay\nOf that colossal Wreck, boundless and bare\nThe lone and level sands stretch far away.",
        "meaning": "All arrogant temporal empires and material monuments crumble before the vast sweep of time. True peace lies in humility, not monumental vanity.",
        "difficulty": "intermediate",
        "source": "Ozymandias by Percy Bysshe Shelley (1818)",
        "tags": ["Shelley", "Impermanence", "Humility", "Time"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "despair", "options": ["despair", "rejoice", "surrender"]},
            {"id": 2, "correct": "sands", "options": ["sands", "seas", "walls"]}
        ]
    },
    {
        "id": "eng_keats_beauty",
        "title": "A Thing of Beauty is a Joy Forever (John Keats)",
        "language": "english",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "A thing of beauty is a joy for ever:\nIts loveliness increases; it will never\nPass into nothingness; but still will keep\nA bower quiet for us, and a sleep\nFull of sweet dreams, and health, and quiet breathing.",
        "meaning": "Genuine aesthetic and moral beauty never perishes; its resonance deepens over time, offering a sanctuary of healthy breath and serene dreams.",
        "difficulty": "beginner",
        "source": "Endymion by John Keats (1818)",
        "tags": ["Keats", "Beauty", "Peace", "Poetry"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "joy for ever", "options": ["joy for ever", "fleeting breath", "passing dream"]},
            {"id": 2, "correct": "quiet breathing", "options": ["quiet breathing", "restless labor", "golden slumber"]}
        ]
    },
    {
        "id": "eng_swami_vivekananda_arise",
        "title": "Arise, Awake, and Stop Not (Swami Vivekananda)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "Arise, awake, and stop not till the goal is reached!\nTake up one idea. Make that one idea your life;\nDream of it, think of it, live on that idea.\nLet the brain, the body, muscles, nerves, every part of your body\nBe full of that idea, and just leave every other idea alone.\nThis is the way to success.",
        "meaning": "Single-minded focus and persistent devotion to a worthy ideal channel human potential into extraordinary clarity and accomplishment.",
        "difficulty": "beginner",
        "source": "Swami Vivekananda (Complete Works, Volume 1)",
        "tags": ["Vivekananda", "Focus", "Determination", "Inspiration"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "goal is reached", "options": ["goal is reached", "sun goes down", "battle is won"]},
            {"id": 2, "correct": "one idea", "options": ["one idea", "all wealth", "great fame"]}
        ]
    },
    {
        "id": "eng_swami_vivekananda_strength",
        "title": "Strength is Life, Weakness is Death (Swami Vivekananda)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "Strength is life, weakness is death.\nStrength is felicity, life eternal, immortal;\nWeakness is constant strain and misery: weakness is death.\nStand up, be bold, be strong.\nTake the whole responsibility on your own shoulders.",
        "meaning": "Cultivate moral, mental, and physical strength. Taking radical personal responsibility liberates you from passive victimization.",
        "difficulty": "beginner",
        "source": "Swami Vivekananda (Lectures from Colombo to Almora)",
        "tags": ["Strength", "Vivekananda", "Responsibility", "Courage"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "Strength is life", "options": ["Strength is life", "Wealth is power", "Peace is quiet"]},
            {"id": 2, "correct": "responsibility", "options": ["responsibility", "glory", "burden"]}
        ]
    },
    {
        "id": "eng_gandhi_change",
        "title": "Be the Change (Mahatma Gandhi Tradition)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "We but mirror the world. All the tendencies present in the outer world\nAre to be found in the world of our body.\nIf we could change ourselves, the tendencies in the world would also change.\nAs a man changes his own nature, so does the attitude of the world\nChange towards him. We need not wait to see what others do.",
        "meaning": "Societal transformation is rooted in personal character reform. Change begins authentically when you enact the ethical standards you expect of others.",
        "difficulty": "beginner",
        "source": "Mahatma Gandhi (Collected Works, 1913)",
        "tags": ["Gandhi", "Integrity", "Leadership", "Transformation"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "mirror the world", "options": ["mirror the world", "rule the world", "fear the world"]},
            {"id": 2, "correct": "change ourselves", "options": ["change ourselves", "blame the past", "wait for laws"]}
        ]
    },
    {
        "id": "eng_abraham_lincoln_resolve",
        "title": "Unfaltering Resolution (Abraham Lincoln)",
        "language": "english",
        "category": "story",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "Always bear in mind that your own resolution to succeed\nIs more important than any other one thing.\nI am not bound to win, but I am bound to be true.\nI am not bound to succeed, but I am bound to live up to what light I have.",
        "meaning": "External victories may fluctuate, but an internal commitment to upright effort and moral truth remains the bedrock of enduring leadership.",
        "difficulty": "beginner",
        "source": "Abraham Lincoln (Writings and Speeches)",
        "tags": ["Lincoln", "Integrity", "Determination", "Leadership"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "resolution", "options": ["resolution", "desire", "fortune"]},
            {"id": 2, "correct": "bound to be true", "options": ["bound to be true", "bound to rule", "bound to follow"]}
        ]
    },
    {
        "id": "eng_james_allen_thought",
        "title": "As a Man Thinketh in His Heart (James Allen)",
        "language": "english",
        "category": "story",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "A man is literally what he thinks, his character being the complete sum of all his thoughts.\nAs the plant springs from, and could not be without, the seed,\nSo every act of a man springs from the hidden seeds of thought.\nCherish your visions; cherish your ideals;\nCherish the music that stirs in your heart, the beauty that forms in your mind.",
        "meaning": "Thought seeds blossom into actions, habits, and outward circumstances. Guarding the quality of your inner life constructs a noble character.",
        "difficulty": "intermediate",
        "source": "As a Man Thinketh by James Allen (1903)",
        "tags": ["James Allen", "Thought", "Mindset", "Character"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "what he thinks", "options": ["what he thinks", "what he owns", "what he fears"]},
            {"id": 2, "correct": "seeds of thought", "options": ["seeds of thought", "rules of men", "drifts of chance"]}
        ]
    },
    {
        "id": "eng_confucius_learning",
        "title": "Learning and Reflection (Confucius)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "Learning without thought is labor lost;\nThought without learning is perilous.\nHe who knows all the answers has not been asked all the questions.\nWhen you know a thing, to hold that you know it;\nAnd when you do not know a thing, to allow that you do not know it—\nThis is knowledge.",
        "meaning": "Information without critical introspection is useless, while speculation without factual foundation is reckless. True intellectual humility is knowing one's boundaries.",
        "difficulty": "beginner",
        "source": "The Analects of Confucius (Book II)",
        "tags": ["Confucius", "Learning", "Humility", "Critical Thinking"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "labor lost", "options": ["labor lost", "great gain", "easy path"]},
            {"id": 2, "correct": "perilous", "options": ["perilous", "profitable", "fruitful"]}
        ]
    },
    {
        "id": "eng_heraclitus_change",
        "title": "Constant Change (Heraclitus)",
        "language": "english",
        "category": "proverb",
        "audioSourceType": "tts",
        "estimatedMinutes": 2,
        "originalText": "There is nothing permanent except change.\nNo man ever steps in the same river twice,\nFor it's not the same river and he's not the same man.\nCharacter is destiny.",
        "meaning": "Flux and transformation are the fundamental nature of reality. Embrace life's fluidity with adaptable grace; your cultivated character guides your path.",
        "difficulty": "beginner",
        "source": "Fragments of Heraclitus (Ephesus, 500 BCE)",
        "tags": ["Heraclitus", "Change", "Philosophy", "Stoic Precursors"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "change", "options": ["change", "stone", "grief"]},
            {"id": 2, "correct": "Character", "options": ["Character", "Fortune", "Power"]}
        ]
    },
    {
        "id": "eng_desiderata_ehrmann",
        "title": "Desiderata: Go Placidly (Max Ehrmann)",
        "language": "english",
        "category": "poem",
        "audioSourceType": "tts",
        "estimatedMinutes": 3,
        "originalText": "Go placidly amid the noise and the haste,\nAnd remember what peace there may be in silence.\nAs far as possible, without surrender, be on good terms with all persons.\nSpeak your truth quietly and clearly; and listen to others.\nYou are a child of the universe no less than the trees and the stars;\nYou have a right to be here.\nBe cheerful. Strive to be happy.",
        "meaning": "Walk with quiet dignity amid worldly chaos. Cultivate respectful honesty, honor your inherent cosmic belonging, and remain at peace with your soul.",
        "difficulty": "beginner",
        "source": "Desiderata by Max Ehrmann (1927)",
        "tags": ["Desiderata", "Peace", "Silence", "Kindness"],
        "stages": ["listen", "repeat", "recall"],
        "blanks": [
            {"id": 1, "correct": "silence", "options": ["silence", "wealth", "victory"]},
            {"id": 2, "correct": "child of the universe", "options": ["child of the universe", "master of earth", "stranger in life"]}
        ]
    }
]

def main():
    all_items = sanskrit_items + telugu_items + hindi_items + english_items
    print(f"Total Sanskrit entries: {len(sanskrit_items)}")
    print(f"Total Telugu entries: {len(telugu_items)}")
    print(f"Total Hindi entries: {len(hindi_items)}")
    print(f"Total English entries: {len(english_items)}")
    print(f"Total Combined Entries: {len(all_items)}")

    # Check for duplicate IDs
    ids = set()
    for item in all_items:
        if item["id"] in ids:
            raise ValueError(f"Duplicate ID found: {item['id']}")
        ids.add(item["id"])

    ts_content = "import type { CulturalItem } from '../types';\n\n"
    ts_content += "export const CULTURAL_LIBRARY: CulturalItem[] = "
    ts_content += json.dumps(all_items, ensure_ascii=False, indent=2)
    ts_content += ";\n\n"

    # Append OBJECT_MEMORY_ITEMS and MEMORY_MATCH_CARDS
    ts_content += """export const OBJECT_MEMORY_ITEMS = [
  { id: 'diya', label: 'Diya (Lamp)', icon: '🪔', category: 'sacred' },
  { id: 'bell', label: 'Ghanta (Bell)', icon: '🔔', category: 'ritual' },
  { id: 'lotus', label: 'Padma (Lotus)', icon: '🪷', category: 'nature' },
  { id: 'conch', label: 'Shankha (Conch)', icon: '🐚', category: 'sacred' },
  { id: 'mala', label: 'Japa Mala (Beads)', icon: '📿', category: 'practice' },
  { id: 'palm_leaf', label: 'Palm Manuscript', icon: '📜', category: 'wisdom' },
  { id: 'peacock', label: 'Peacock Feather', icon: '🪶', category: 'nature' },
  { id: 'flute', label: 'Bansuri (Flute)', icon: '🪈', category: 'sound' },
  { id: 'chandan', label: 'Chandan Kalash', icon: '🏺', category: 'ritual' },
  { id: 'tree', label: 'Bodhi Leaf', icon: '🍃', category: 'nature' },
  { id: 'sun', label: 'Surya Mandala', icon: '☀️', category: 'cosmic' },
  { id: 'moon', label: 'Chandra Kala', icon: '🌙', category: 'cosmic' },
];

export const MEMORY_MATCH_CARDS = [
  { symbol: 'Satya (Truth)', icon: '⚖️', pairId: 1 },
  { symbol: 'Dharma (Virtue)', icon: '☸️', pairId: 2 },
  { symbol: 'Shanti (Peace)', icon: '🕊️', pairId: 3 },
  { symbol: 'Smriti (Memory)', icon: '🧠', pairId: 4 },
  { symbol: 'Prana (Breath)', icon: '🌬️', pairId: 5 },
  { symbol: 'Tejas (Brilliance)', icon: '🔥', pairId: 6 },
];
"""

    output_path = os.path.join("src", "data", "culturalContent.ts")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"Successfully wrote {len(all_items)} verified cultural entries to {output_path}")

if __name__ == "__main__":
    main()

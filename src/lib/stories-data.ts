/**
 * مكتبة القصص التعليمية - قصص حقيقية مكتوبة يدوياً بأسلوب أدبي
 * Educational Stories Library - Hand-written stories with literary style
 */

export interface StoryPage {
  ar: string
  en: string
  illustration: string // emoji أو رمز للرسوم
  bgGradient: string
}

export interface Story {
  id: string
  titleAr: string
  titleEn: string
  category: 'adventure' | 'bedtime' | 'educational' | 'moral'
  categoryAr: string
  categoryEn: string
  ageRange: string
  durationMin: number
  coverEmoji: string
  coverGradient: string
  bgTheme: string
  authorAr: string
  authorEn: string
  descriptionAr: string
  descriptionEn: string
  pages: StoryPage[]
  lessonAr: string
  lessonEn: string
  tagsAr: string[]
  tagsEn: string[]
}

export const stories: Story[] = [
  // ============ القصة 1 ============
  {
    id: 'rabbit-treasure',
    titleAr: 'كنز الأرنب الحكيم',
    titleEn: 'The Wise Rabbit\'s Treasure',
    category: 'adventure',
    categoryAr: 'مغامرة',
    categoryEn: 'Adventure',
    ageRange: '5-8',
    durationMin: 5,
    coverEmoji: '🐰',
    coverGradient: 'from-amber-400 via-orange-400 to-rose-400',
    bgTheme: 'forest',
    authorAr: 'إعداد فريق كوبيستو',
    authorEn: 'By Kopisto Team',
    descriptionAr: 'في غابة بعيدة، يعيش أرنب صغير اسمه كوبيستو يبحث عن كنز أسطوري. هل سينجح في مهمته؟',
    descriptionEn: 'In a faraway forest, a little rabbit named Kopisto searches for a legendary treasure. Will he succeed?',
    pages: [
      {
        ar: 'في أعماق الغابة القديمة، حيث تتعانق أغصان الأشجار وتُغنّي العصافير ألحانها، كان الأرنب الصغير كوبيستو يجلس تحت شجرة البلوط العجوز. عيناه الزرقاوان تتأملان خريطة قديمة ورثها من جدّه الكبير.',
        en: 'Deep in the ancient forest, where tree branches embrace and birds sing their melodies, the little rabbit Kopisto sat under the old oak tree. His blue eyes gazed at an old map he had inherited from his grandfather.',
        illustration: '🌳',
        bgGradient: 'from-emerald-50 to-green-100',
      },
      {
        ar: 'قال جدّه يوماً: "يا بُنيّ، الكنز الحقيقي ليس في الذهب والفضة، بل في الحكمة التي تكسبها خلال رحلتك". لم يفهم كوبيستو هذه الكلمات حينها، لكنه كان مصمّماً على اكتشاف سرّها.',
        en: 'His grandfather once said: "My child, true treasure is not in gold and silver, but in the wisdom you gain along your journey." Kopisto didn\'t understand these words then, but he was determined to discover their secret.',
        illustration: '📜',
        bgGradient: 'from-amber-50 to-yellow-100',
      },
      {
        ar: 'انطلق كوبيستو في الصباح الباكر، يحمل خريطته وحقيبة صغيرة فيها بعض الجزر وجمّاعة ماء. في طريقه، التقى بسنجاب صغير يبكي عند مفترق الطرق.',
        en: 'Kopisto set off in the early morning, carrying his map and a small bag with some carrots and a water bottle. On his way, he met a little squirrel crying at a crossroads.',
        illustration: '🐿️',
        bgGradient: 'from-orange-50 to-amber-100',
      },
      {
        ar: 'قال السنجاب: "ضعتُ يا صديقي! لا أعرف طريق بيتي". توقّف كوبيستو عن البحث عن الكنز للحظة، وقرّر مساعدة السنجاب. معاً، بحثا عن بيته حتى وجداه عند شجرة الجوز الكبيرة.',
        en: 'The squirrel said: "I\'m lost, my friend! I don\'t know the way home." Kopisto paused his treasure hunt for a moment and decided to help the squirrel. Together, they searched for his home until they found it at the big walnut tree.',
        illustration: '🏡',
        bgGradient: 'from-sky-50 to-blue-100',
      },
      {
        ar: 'شكر السنجاب كوبيستو بحرارة وأعطاه بذرة جوز ذهبية قائلاً: "هذه البذرة السحرية ستنفعك يوماً ما". ابتسم كوبيستو وواصل رحلته، شاعراً بدفء غريب في قلبه.',
        en: 'The squirrel thanked Kopisto warmly and gave him a golden walnut seed, saying: "This magical seed will help you someday." Kopisto smiled and continued his journey, feeling a strange warmth in his heart.',
        illustration: '🌰',
        bgGradient: 'from-yellow-50 to-amber-100',
      },
      {
        ar: 'بعد ساعات من المشي، وصل كوبيستو إلى نهر واسع. لم يكن هناك جسر يعبره، والماء يجري بسرعة. جلس على الضفّة حائراً، يفكّر في حلّ للمشكلة.',
        en: 'After hours of walking, Kopisto reached a wide river. There was no bridge to cross, and the water flowed rapidly. He sat on the bank, puzzled, thinking of a solution.',
        illustration: '🌊',
        bgGradient: 'from-cyan-50 to-blue-100',
      },
      {
        ar: 'فجأة، ظهرت سلحفاة عجوز من الماء وقالت: "يا بُنيّ، أرى أنك محتار. هل أساعدك على العبور؟" فرح كوبيستو كثيراً، وصعد على ظهر السلحفاة بهدوء.',
        en: 'Suddenly, an old turtle emerged from the water and said: "My child, I see you\'re puzzled. Shall I help you cross?" Kopisto was overjoyed and quietly climbed onto the turtle\'s back.',
        illustration: '🐢',
        bgGradient: 'from-teal-50 to-emerald-100',
      },
      {
        ar: 'وأثناء العبور، سألته السلحفاة: "لماذا تريد عبور النهر؟" أجابها: "أبحث عن كنز جدّي". ابتسمت السلحفاة وقالت: "الكنوز الحقيقية لا تُوزَن بالذهب".',
        en: 'While crossing, the turtle asked: "Why do you want to cross the river?" He replied: "I\'m searching for my grandfather\'s treasure." The turtle smiled and said: "True treasures aren\'t measured in gold."',
        illustration: '💧',
        bgGradient: 'from-blue-50 to-cyan-100',
      },
      {
        ar: 'على الضفّة الأخرى، شكر كوبيستو السلحفاة وأعطاها جزرة من حقيبته. واصل سيره حتى وصل إلى كهف صغير مكسو بالطحالب الخضراء. كان هذا هو مكان الكنز!',
        en: 'On the other bank, Kopisto thanked the turtle and gave her a carrot from his bag. He continued walking until he reached a small cave covered with green moss. This was the treasure\'s location!',
        illustration: '🏔️',
        bgGradient: 'from-emerald-50 to-teal-100',
      },
      {
        ar: 'دخل كوبيستو الكهف بحذر، ووجد صندوقاً خشبياً قديماً. فتحه ببطء... ولم يجد ذهباً ولا فضة! بدلاً من ذلك، وجد كتاباً قديماً ومرآة لامعة.',
        en: 'Kopisto entered the cave cautiously and found an old wooden box. He opened it slowly... and found no gold or silver! Instead, he found an old book and a shining mirror.',
        illustration: '📦',
        bgGradient: 'from-stone-50 to-amber-100',
      },
      {
        ar: 'فتح الكتاب وقرأ: "هذا الكتاب يحتوي على حكمة الأجيال. اقرأه، وتعلّم منه، وعلّم غيرك. أما المرآة فلتذكّرك دائماً بأنك أنت الكنز الحقيقي".',
        en: 'He opened the book and read: "This book contains the wisdom of generations. Read it, learn from it, and teach others. As for the mirror, let it always remind you that you are the true treasure."',
        illustration: '📖',
        bgGradient: 'from-yellow-50 to-orange-100',
      },
      {
        ar: 'فهم كوبيستو أخيراً معنى كلمات جدّه! الكنز ليس ذهباً يُدفن في الأرض، بل هو الحكمة التي نكتسبها، والصداقات التي نكوّنها، والخير الذي نفعله.',
        en: 'Kopisto finally understood his grandfather\'s words! Treasure is not gold buried in the ground, but the wisdom we gain, the friendships we make, and the good we do.',
        illustration: '✨',
        bgGradient: 'from-amber-50 to-yellow-100',
      },
      {
        ar: 'عاد كوبيستو إلى غابته محمّلاً بالكنز الحقيقي. أصبح يحكي قصصه للأطفال الصغار، ويعلّمهم الحكمة. ومن يومها، صار يُعرف بـ"الأرنب الحكيم".',
        en: 'Kopisto returned to his forest loaded with the true treasure. He began telling his stories to the little ones, teaching them wisdom. From that day, he became known as "The Wise Rabbit."',
        illustration: '🌟',
        bgGradient: 'from-rose-50 to-orange-100',
      },
    ],
    lessonAr: 'الكنز الحقيقي في حياتنا هو الحكمة والصداقة والخير الذي نقدمه للآخرين، وليس الذهب والمال.',
    lessonEn: 'The true treasure in our lives is wisdom, friendship, and the good we do for others, not gold and money.',
    tagsAr: ['مغامرة', 'حكمة', 'صداقة', 'مساعدة'],
    tagsEn: ['Adventure', 'Wisdom', 'Friendship', 'Helping'],
  },

  // ============ القصة 2 ============
  {
    id: 'sleepy-star',
    titleAr: 'النجمة التي أرادت أن تنام',
    titleEn: 'The Sleepy Little Star',
    category: 'bedtime',
    categoryAr: 'قبل النوم',
    categoryEn: 'Bedtime',
    ageRange: '3-6',
    durationMin: 4,
    coverEmoji: '⭐',
    coverGradient: 'from-indigo-500 via-purple-500 to-pink-500',
    bgTheme: 'space',
    authorAr: 'إعداد فريق كوبيستو',
    authorEn: 'By Kopisto Team',
    descriptionAr: 'نجمة صغيرة في السماء لم تستطع النوم. كيف ساعدها القمر على الراحة؟ قصة هادئة للأطفال قبل النوم.',
    descriptionEn: 'A little star in the sky couldn\'t sleep. How did the moon help her rest? A calming bedtime story for children.',
    pages: [
      {
        ar: 'في ليلة صافية من ليالي الصيف، كانت السماء مليئة بالنجوم اللامعة. كل نجمة كانت تومض بفرح، ما عدا نجمة صغيرة اسمها "نورة" كانت تشعر بالتعب.',
        en: 'On a clear summer night, the sky was filled with shining stars. Every star twinkled with joy, except a little star named "Nura" who felt tired.',
        illustration: '🌌',
        bgGradient: 'from-indigo-100 to-purple-100',
      },
      {
        ar: 'قالت نورة لأمها القمر: "يا أمّي، أريد أن أنام لكنني لا أستطيع! الأرض تحته جميلة جداً، والأطفال يلعبون، والعصافير تُغنّي..."',
        en: 'Nura said to her mother the Moon: "Mother, I want to sleep but I can\'t! The Earth below is so beautiful, the children are playing, and the birds are singing..."',
        illustration: '🌙',
        bgGradient: 'from-purple-100 to-pink-100',
      },
      {
        ar: 'ابتسمت الأم القمر بحنان وقالت: "يا حبيبتي، النجوم أيضاً تحتاج إلى الراحة. تعالي، سأحكي لكِ سرّاً جميلاً يساعدك على النوم".',
        en: 'The Moon Mother smiled tenderly and said: "My dear, even stars need rest. Come, I\'ll tell you a beautiful secret to help you sleep."',
        illustration: '💫',
        bgGradient: 'from-violet-100 to-indigo-100',
      },
      {
        ar: 'قال القمر: "كل ليلة، عندما يحين وقت النوم، تخيّلي أنكِ تنزلين بلطف على الأرض، كريشة بيضاء في نسمة هواء. تذهبين إلى غرفة طفل صغير يحتاج إلى نجمته الحارسة".',
        en: 'The Moon said: "Every night, when it\'s time to sleep, imagine you\'re gently descending to Earth, like a white feather on a breeze. You go to a little child\'s room who needs their guardian star."',
        illustration: '🌟',
        bgGradient: 'from-blue-100 to-purple-100',
      },
      {
        ar: 'تابع القمر: "تنامين بجانب الطفل، وتحرسين أحلامه الجميلة. وعندما يصبح الصباح، تعودين إلى السماء مبتسمة، لأنك ساعدتِ طفلاً على النوم بهدوء".',
        en: 'The Moon continued: "You sleep beside the child and guard their beautiful dreams. And when morning comes, you return to the sky smiling, because you helped a child sleep peacefully."',
        illustration: '👼',
        bgGradient: 'from-pink-100 to-rose-100',
      },
      {
        ar: 'بدأت نورة تتخيّل ما قاله القمر. تخيّلت طفلاً صغيراً ينتظر نجمته. شعرت بدفء غريب في قلبها، وبدأت جفونها الثقيلة تغلق...',
        en: 'Nura began to imagine what the Moon said. She pictured a little child waiting for their star. She felt a strange warmth in her heart, and her heavy eyelids began to close...',
        illustration: '😴',
        bgGradient: 'from-indigo-100 to-blue-100',
      },
      {
        ar: ' "يا أمّي"، همست نورة، "أشعر بالنعاس... أشعر بالسلام..." ثم أغمضت عينيها، وأصبح وميضها هادئاً كنبضات قلب طفل نائم.',
        en: '"Mother," Nura whispered, "I feel sleepy... I feel peace..." Then she closed her eyes, and her twinkling became calm like a sleeping child\'s heartbeat.',
        illustration: '✨',
        bgGradient: 'from-purple-100 to-indigo-100',
      },
      {
        ar: 'في تلك الليلة، نام الأطفال في كل مكان بهدوء وطمأنينة، لأن نورة كانت تحرس أحلامهم. وكان القمر يبتسم، فخوراً بنجمته الصغيرة.',
        en: 'That night, children everywhere slept peacefully and calmly, because Nura was guarding their dreams. And the Moon smiled, proud of his little star.',
        illustration: '🌛',
        bgGradient: 'from-violet-100 to-purple-100',
      },
    ],
    lessonAr: 'النوم مهم لجسدنا وعقلنا، وعندما ننام بهدوء، نستيقظ بنشاط وفرح في اليوم التالي.',
    lessonEn: 'Sleep is important for our body and mind. When we sleep peacefully, we wake up with energy and joy the next day.',
    tagsAr: ['قبل النوم', 'هدوء', 'نجوم', 'أحلام'],
    tagsEn: ['Bedtime', 'Calm', 'Stars', 'Dreams'],
  },

  // ============ القصة 3 ============
  {
    id: 'brave-turtle',
    titleAr: 'السلحفاة الشجاعة',
    titleEn: 'The Brave Turtle',
    category: 'moral',
    categoryAr: 'قيم وأخلاق',
    categoryEn: 'Moral',
    ageRange: '5-9',
    durationMin: 6,
    coverEmoji: '🐢',
    coverGradient: 'from-teal-400 via-emerald-400 to-green-500',
    bgTheme: 'pond',
    authorAr: 'إعداد فريق كوبيستو',
    authorEn: 'By Kopisto Team',
    descriptionAr: 'سلحفاة صغيرة يستهزئ بها أصدقاؤها بسبب بطئها، لكنها تُظهر شجاعتها عندما يحين الوقت. قصة عن قوة الإرادة.',
    descriptionEn: 'A little turtle is teased by friends for being slow, but shows her courage when the time comes. A story about willpower.',
    pages: [
      {
        ar: 'عند بركة صغيرة في الحديقة، كانت تعيش سلحفاة لطيفة اسمها "سمسم". كانت سمسم تمشي ببطء شديد، وهذا جعل الأرنب والأرنب والثعلب يضحكون عليها.',
        en: 'At a small pond in the garden, lived a kind turtle named "Samsam". Samsam walked very slowly, and this made the rabbit, the hare, and the fox laugh at her.',
        illustration: '🐢',
        bgGradient: 'from-teal-50 to-emerald-100',
      },
      {
        ar: 'قال الأرنب يوماً: "يا سمسم، لماذا أنتِ بطيئة هكذا؟ أنا أركض كالريح!" أضافت الأرنب البريئة: "حتى أنا أقفز أسرع منك!" وضحكوا جميعاً.',
        en: 'One day the rabbit said: "Samsam, why are you so slow? I run like the wind!" The hare added: "Even I hop faster than you!" And they all laughed.',
        illustration: '🐰',
        bgGradient: 'from-orange-50 to-amber-100',
      },
      {
        ar: 'حزنت سمسم كثيراً، لكنها لم تفقد الأمل. قالت لنفسها: "كل واحد منا له نقاط قوة مختلفة. سأثبت لهم أنني أستطيع فعل أشياء عظيمة".',
        en: 'Samsam was very sad, but she didn\'t lose hope. She told herself: "Each of us has different strengths. I\'ll show them I can do great things."',
        illustration: '💧',
        bgGradient: 'from-blue-50 to-cyan-100',
      },
      {
        ar: 'في يوم من الأيام، حدث أمر مفاجئ. انكسر سدّ البركة الصغيرة، وبدأ الماء يفيض بسرعة نحو بيوت الحيوانات الصغيرة! الجميع خاف ولم يعرف ماذا يفعل.',
        en: 'One day, something unexpected happened. The small pond\'s dam broke, and water began flooding rapidly toward the small animals\' homes! Everyone was afraid and didn\'t know what to do.',
        illustration: '🌊',
        bgGradient: 'from-cyan-50 to-blue-100',
      },
      {
        ar: 'صرخ الأرنب: "النجدة! النجدة! ماذا نفعل؟" وقفز الأرنب البريء ذهاباً وإياباً دون جدوى. حتى الثعلب الماكر وقف حائراً.',
        en: 'The rabbit screamed: "Help! Help! What do we do?" The hare hopped back and forth to no avail. Even the cunning fox stood puzzled.',
        illustration: '😱',
        bgGradient: 'from-red-50 to-orange-100',
      },
      {
        ar: 'في تلك اللحظة، تذكّرت سمسم شيئاً مهمّاً. كانت تعرف أن هناك صخرة كبيرة قديمة يمكن استخدامها لسدّ الفجوة! لكن الصخرة كانت بعيدة.',
        en: 'At that moment, Samsam remembered something important. She knew there was a large old rock that could be used to plug the gap! But the rock was far away.',
        illustration: '🪨',
        bgGradient: 'from-stone-50 to-gray-100',
      },
      {
        ar: 'انطلقت سمسم نحو الصخرة بكل ما أوتيت من قوة. كانت بطيئة، نعم، لكنها لم تستسلم. خطوة بخطوة، وصلت إلى الصخرة وبدأت تدفعها نحو البركة.',
        en: 'Samsam set off toward the rock with all her might. She was slow, yes, but she didn\'t give up. Step by step, she reached the rock and began pushing it toward the pond.',
        illustration: '💪',
        bgGradient: 'from-emerald-50 to-teal-100',
      },
      {
        ar: 'استغرق الأمر وقتاً طويلاً، لكن سمسم لم تتوقف. أخيراً، وصلت بالصخرة إلى الفجوة ووضعتها بإحكام. توقّف الفيضان، وأنقذت الحيوانات جميعاً!',
        en: 'It took a long time, but Samsam didn\'t stop. Finally, she got the rock to the gap and placed it firmly. The flooding stopped, and she saved all the animals!',
        illustration: '🎉',
        bgGradient: 'from-yellow-50 to-amber-100',
      },
      {
        ar: 'جاء الأرنب والأرنب والثعلب يركضون نحو سمسم. قال الأرنب: "سمسم، أنتِ بطلة! أنقذتنا جميعاً! أنا آسف لأنني سخرت منكِ".',
        en: 'The rabbit, hare, and fox came running to Samsam. The rabbit said: "Samsam, you\'re a hero! You saved us all! I\'m sorry I made fun of you."',
        illustration: '🤝',
        bgGradient: 'from-pink-50 to-rose-100',
      },
      {
        ar: 'ابتسمت سمسم وقالت: "لا بأس يا أصدقائي. المهم أننا تعلّمنا أن لكل واحد منا قوته الخاصة. البطء ليس عيباً، فأحياناً الإصرار والصبر يفوقان السرعة".',
        en: 'Samsam smiled and said: "It\'s okay, my friends. What matters is that we learned each of us has their own strength. Slowness is not a flaw, sometimes perseverance and patience surpass speed."',
        illustration: '😊',
        bgGradient: 'from-emerald-50 to-green-100',
      },
      {
        ar: 'منذ ذلك اليوم، احترم الجميع سمسم ولم يسخر منها أحد. وأصبحت سمسم صديقة لكل الحيوانات، تعلّمهم أن القوة تُقاس بالإصرار لا بالسرعة.',
        en: 'From that day, everyone respected Samsam and no one made fun of her. Samsam became friends with all the animals, teaching them that strength is measured by perseverance, not speed.',
        illustration: '🌈',
        bgGradient: 'from-teal-50 to-emerald-100',
      },
    ],
    lessonAr: 'لا تقلل من قيمة أي شخص بسبب مظهره أو بطئه. كل واحد له نقاط قوة، والإصرار والصبر يحققان المستحيل.',
    lessonEn: 'Don\'t underestimate anyone because of their appearance or slowness. Everyone has strengths, and perseverance and patience achieve the impossible.',
    tagsAr: ['شجاعة', 'إصرار', 'صداقة', 'احترام'],
    tagsEn: ['Courage', 'Perseverance', 'Friendship', 'Respect'],
  },

  // ============ القصة 4 ============
  {
    id: 'curious-cloud',
    titleAr: 'الغيمة الفضولية',
    titleEn: 'The Curious Cloud',
    category: 'educational',
    categoryAr: 'تعليمية',
    categoryEn: 'Educational',
    ageRange: '4-7',
    durationMin: 5,
    coverEmoji: '☁️',
    coverGradient: 'from-sky-400 via-cyan-400 to-blue-500',
    bgTheme: 'sky',
    authorAr: 'إعداد فريق كوبيستو',
    authorEn: 'By Kopisto Team',
    descriptionAr: 'غيمة صغيرة تريد أن تعرف من أين يأتي المطر. تذهب في رحلة تعليمية تكتشف فيها أسرار الطبيعة.',
    descriptionEn: 'A little cloud wants to know where rain comes from. She goes on an educational journey discovering nature\'s secrets.',
    pages: [
      {
        ar: 'في سماء زرقاء صافية، كانت غيمة صغيرة بيضاء تطفو بهدوء. اسمها "غيمة"، وكانت دائماً تطرح أسئلة كثيرة على أمها الغيمة الكبيرة.',
        en: 'In a clear blue sky, a small white cloud floated peacefully. Her name was "Ghayma", and she always asked many questions of her mother the Big Cloud.',
        illustration: '☁️',
        bgGradient: 'from-sky-50 to-blue-100',
      },
      {
        ar: 'سألت غيمة أمها يوماً: "يا أمّي، من أين يأتي المطر؟ كيف نصبح نحن غيوماً ممطرة؟" ابتسمت الأم وقالت: "تعالي أعلمك يا حبيبتي".',
        en: 'One day Ghayma asked her mother: "Mother, where does rain come from? How do we become raining clouds?" The mother smiled and said: "Come, let me teach you, my dear."',
        illustration: '🌧️',
        bgGradient: 'from-blue-50 to-cyan-100',
      },
      {
        ar: 'قالت الأم: "كل شيء يبدأ من البحر. الشمس تُسخّن الماء، فيتحوّل إلى بخار غير مرئي يصعد إلى السماء. هذا ما نسمّيه التبخّر".',
        en: 'The mother said: "Everything begins at the sea. The sun heats the water, turning it into invisible vapor that rises to the sky. This is called evaporation."',
        illustration: '🌊',
        bgGradient: 'from-cyan-50 to-blue-100',
      },
      {
        ar: 'تابعت الأم: "عندما يصعد البخار عالياً، يصبح الجو بارداً. فيتكثّف ويتجمّع على ذرّات صغيرة من الغبار في الهواء، ويتحول إلى قطرات ماء صغيرة. هذا ما نسمّيه التكاثف".',
        en: 'The mother continued: "When the vapor rises high, the air gets cold. It condenses and gathers on tiny dust particles in the air, becoming small water droplets. This is called condensation."',
        illustration: '💧',
        bgGradient: 'from-indigo-50 to-blue-100',
      },
      {
        ar: '"هذه القطرات الصغيرة هي التي تكوّننا، نحن الغيوم!" قالت الأم. "عندما نتجمع كثيراً وتصبح القطرات كبيرة وثقيلة، تسقط على الأرض كمطر. هذا هو الهطول".',
        en: '"These tiny droplets are what make us, the clouds!" said the mother. "When we gather too much and the droplets become large and heavy, they fall to Earth as rain. This is precipitation."',
        illustration: '🌧️',
        bgGradient: 'from-blue-50 to-indigo-100',
      },
      {
        ar: 'سألت غيمة: "وماذا يحدث للمطر بعد أن يسقط؟" أجابت الأم: "الماء يتجمّع في الأنهار والبحيرات، وينخرط في الأرض، ثم يرجع إلى البحر. وهكذا تبدأ الدورة من جديد!".',
        en: 'Ghayma asked: "And what happens to the rain after it falls?" The mother answered: "The water gathers in rivers and lakes, seeps into the ground, then returns to the sea. And so the cycle begins again!"',
        illustration: '🔄',
        bgGradient: 'from-cyan-50 to-teal-100',
      },
      {
        ar: 'فرحت غيمة كثيراً بمعرفة هذا السرّ العظيم. قالت: "إذن نحن نساعد الأرض! المطر يسقي النباتات، ويملأ الأنهار، ويسقي العطاش!"',
        en: 'Ghayma was very happy to know this great secret. She said: "Then we help the Earth! Rain waters plants, fills rivers, and quenches the thirsty!"',
        illustration: '🌱',
        bgGradient: 'from-emerald-50 to-green-100',
      },
      {
        ar: 'قالت الأم: "نعم يا حبيبتي. كل قطرة مطر لها أهمية. الله جعل الماء سرّ الحياة، ونحن غيوم نحن رسل الخير بين البحر والأرض".',
        en: 'The mother said: "Yes, my dear. Every raindrop matters. God made water the secret of life, and we clouds are messengers of goodness between the sea and the land."',
        illustration: '✨',
        bgGradient: 'from-yellow-50 to-amber-100',
      },
      {
        ar: 'في تلك اللحظة، شعرت غيمة بأنها كبرت قليلاً. أصبحت تفهم دورها في الكون. وببطء، بدأت قطرات الماء تتجمّع فيها، وأصبحت أثقل وأثقل.',
        en: 'At that moment, Ghayma felt she had grown a little. She began to understand her role in the universe. Slowly, water droplets began to gather in her, and she became heavier and heavier.',
        illustration: '☁️',
        bgGradient: 'from-gray-50 to-blue-100',
      },
      {
        ar: 'قالت غيمة بسعادة: "يا أمّي! أعتقد أنني سأمطر لأول مرة!" ابتسمت الأم بفخر وقالت: "اذهبي يا حبيبتي، الأرض تنتظرك!".',
        en: 'Ghayma said happily: "Mother! I think I\'m going to rain for the first time!" The mother smiled proudly and said: "Go, my dear, the Earth is waiting for you!"',
        illustration: '🌧️',
        bgGradient: 'from-blue-50 to-cyan-100',
      },
      {
        ar: 'سقطت قطرات غيمة على حديقة جميلة جافة. الأزهار فتحت أبوابها بفرح، والأشجار ارتوت، والأطفال خرجوا يلعبون تحت المطر بضحكات بريئة.',
        en: 'Ghayma\'s drops fell on a beautiful dry garden. Flowers opened their doors with joy, trees were watered, and children came out to play in the rain with innocent laughter.',
        illustration: '🌷',
        bgGradient: 'from-pink-50 to-rose-100',
      },
      {
        ar: 'فهمت غيمة أن المعرفة تجعلنا أكثر فائدة. عندما نعرف دورنا في الحياة، نؤدّيه بأفضل شكل، ونترك أثراً جميلاً في كل مكان نمرّ فيه.',
        en: 'Ghayma understood that knowledge makes us more useful. When we know our role in life, we perform it in the best way, and leave a beautiful impact everywhere we go.',
        illustration: '🌈',
        bgGradient: 'from-sky-50 to-cyan-100',
      },
    ],
    lessonAr: 'دورة الماء في الطبيعة معجزة علمية جميلة. المعرفة تجعلنا أكثر فائدة لأنفسنا وللآخرين.',
    lessonEn: 'The water cycle in nature is a beautiful scientific miracle. Knowledge makes us more useful to ourselves and others.',
    tagsAr: ['تعليمية', 'طبيعة', 'علم', 'ماء'],
    tagsEn: ['Educational', 'Nature', 'Science', 'Water'],
  },

  // ============ القصة 5 ============
  {
    id: 'honest-woodcutter',
    titleAr: 'الحطّاب الصادق',
    titleEn: 'The Honest Woodcutter',
    category: 'moral',
    categoryAr: 'قيم وأخلاق',
    categoryEn: 'Moral',
    ageRange: '5-10',
    durationMin: 5,
    coverEmoji: '🪓',
    coverGradient: 'from-amber-500 via-orange-500 to-red-500',
    bgTheme: 'forest',
    authorAr: 'إعداد فريق كوبيستو',
    authorEn: 'By Kopisto Team',
    descriptionAr: 'قصة خالدة عن حطّاب فقير فقد فأسه في النهر، فظهر له ملاك يختبر صدقه. قصة عن الصدق والأمانة.',
    descriptionEn: 'A timeless tale about a poor woodcutter who lost his axe in the river, and an angel appeared to test his honesty. A story about truth and integrity.',
    pages: [
      {
        ar: 'كان يا ما كان، في قديم الزمان، حطّاب فقير اسمه "سالم". كان يعيش في كوخ صغير عند أطراف الغابة، يعمل بجدّ من الصباح حتى المساء ليكسب قوت يومه.',
        en: 'Once upon a time, in days of old, there was a poor woodcutter named "Salem". He lived in a small hut at the forest\'s edge, working hard from morning till evening to earn his daily bread.',
        illustration: '🪵',
        bgGradient: 'from-amber-50 to-orange-100',
      },
      {
        ar: 'كان سالم يملك فأساً واحدة فقط، لكنها كانت غالية عنده لأنها مصدر رزقه. كان يتعهدها بالعناية كل يوم، ويصقلها حتى تلمع كالفضة.',
        en: 'Salem had only one axe, but it was precious to him because it was his source of livelihood. He cared for it every day, polishing it until it shone like silver.',
        illustration: '🪓',
        bgGradient: 'from-stone-50 to-gray-100',
      },
      {
        ar: 'في يوم حارّ من أيام الصيف، ذهب سالم لقطع الحطب قرب النهر. وبينما كان يحاول قطع غصن مائل فوق الماء، انزلقت يده وسقطت الفأس في النهر!',
        en: 'On a hot summer day, Salem went to cut wood near the river. As he tried to cut a branch leaning over the water, his hand slipped and the axe fell into the river!',
        illustration: '💦',
        bgGradient: 'from-cyan-50 to-blue-100',
      },
      {
        ar: 'حزن سالم كثيراً وجلس على الضفّة يبكي. كان يفكّر: "كيف سأطعم أطفالي الآن؟ فأسي الوحيدة ضاعت!" كان الماء عميقاً، ولا يستطيع السباحة جيداً.',
        en: 'Salem was very sad and sat on the bank crying. He thought: "How will I feed my children now? My only axe is lost!" The water was deep, and he couldn\'t swim well.',
        illustration: '😢',
        bgGradient: 'from-blue-50 to-indigo-100',
      },
      {
        ar: 'فجأة، ظهر له ملاك في هيئة رجل طيب من النهر. قال الملاك: "ماذا بك يا حطّاب؟ لماذا تبكي؟" فأخبره سالم بقصته كاملة.',
        en: 'Suddenly, an angel in the form of a kind man appeared from the river. The angel said: "What\'s wrong, woodcutter? Why are you crying?" Salem told him the whole story.',
        illustration: '👼',
        bgGradient: 'from-yellow-50 to-amber-100',
      },
      {
        ar: 'قال الملاك: "سأساعدك". وغطس في النهر، ثم خرج بفأس ذهبية لامعة. سأل سالم: "هل هذه فأسك؟" فأجاب سالم بصدق: "لا، ليست فأسي".',
        en: 'The angel said: "I\'ll help you." He dived into the river, then came out with a shining golden axe. He asked Salem: "Is this your axe?" Salem answered honestly: "No, it\'s not my axe."',
        illustration: '🥇',
        bgGradient: 'from-yellow-50 to-orange-100',
      },
      {
        ar: 'غطس الملاك مرة أخرى، وخرج بفأس فضية جميلة. سأل: "هل هذه فأسك؟" فأجاب سالم: "لا، فأسي لم تكن من فضة ولا ذهب".',
        en: 'The angel dived again, and came out with a beautiful silver axe. He asked: "Is this your axe?" Salem replied: "No, my axe was neither silver nor gold."',
        illustration: '🥈',
        bgGradient: 'from-gray-50 to-slate-100',
      },
      {
        ar: 'في المرة الثالثة، خرج الملاك بفأس حديدية قديمة. صاح سالم بفرح: "نعم! هذه فأسي! هذه فأسي!" وابتسمت شفتاه بعد أن طال انتظاره.',
        en: 'The third time, the angel came out with an old iron axe. Salem cried with joy: "Yes! This is my axe! This is my axe!" His lips smiled after a long wait.',
        illustration: '😊',
        bgGradient: 'from-stone-50 to-amber-100',
      },
      {
        ar: 'ابتسم الملاك وقال: "يا سالم، لقد اختبرت صدقك وأمانتك. أنت لم تكذب رغم أنك فقير. خذ فأسك، وخذ أيضاً الفأس الذهبية والفضية كمكافأة على صدقك".',
        en: 'The angel smiled and said: "Salem, I tested your honesty and integrity. You didn\'t lie even though you\'re poor. Take your axe, and also take the golden and silver axes as a reward for your honesty."',
        illustration: '✨',
        bgGradient: 'from-yellow-50 to-amber-100',
      },
      {
        ar: 'فرح سالم كثيراً وشكر الملاك. عاد إلى بيته يحمل الفأس الثلاثة. عندما رأى جيرانه الفأس الذهبية والفضية، تعجّبوا!',
        en: 'Salem was overjoyed and thanked the angel. He returned home carrying the three axes. When his neighbors saw the golden and silver axes, they were amazed!',
        illustration: '🏠',
        bgGradient: 'from-orange-50 to-amber-100',
      },
      {
        ar: 'أخبرهم سالم بالقصة كاملة، وتعلّم الجميع درساً ثميناً: الصدق والأمانة هما أعظم ثروة يمكن أن يملكها الإنسان، حتى لو كان فقيراً.',
        en: 'Salem told them the whole story, and everyone learned a valuable lesson: honesty and integrity are the greatest wealth a person can have, even if they\'re poor.',
        illustration: '🌟',
        bgGradient: 'from-amber-50 to-yellow-100',
      },
    ],
    lessonAr: 'الصدق والأمانة هما أعظم ثروة. الصادق ينال احترام الناس ومحبة الله، وقد يكافأ بأكثر مما يتوقع.',
    lessonEn: 'Honesty and integrity are the greatest wealth. The honest gain people\'s respect and God\'s love, and may be rewarded beyond expectation.',
    tagsAr: ['صدق', 'أمانة', 'أخلاق', 'قيم'],
    tagsEn: ['Honesty', 'Integrity', 'Ethics', 'Values'],
  },

  // ============ القصة 6 ============
  {
    id: 'little-seed',
    titleAr: 'البذرة الصغيرة',
    titleEn: 'The Little Seed',
    category: 'educational',
    categoryAr: 'تعليمية',
    categoryEn: 'Educational',
    ageRange: '3-6',
    durationMin: 4,
    coverEmoji: '🌱',
    coverGradient: 'from-green-400 via-emerald-400 to-teal-500',
    bgTheme: 'garden',
    authorAr: 'إعداد فريق كوبيستو',
    authorEn: 'By Kopisto Team',
    descriptionAr: 'بذرة صغيرة تخاف من النمو. كيف تتغلّب على خوفها وتصبح شجرة كبيرة؟ قصة عن الشجاعة والصبر.',
    descriptionEn: 'A little seed is afraid to grow. How does she overcome her fear and become a big tree? A story about courage and patience.',
    pages: [
      {
        ar: 'تحت التراب الدافئ، كانت بذرة صغيرة نائمة. كانت محاطة بالتربة الرطبة، تشعر بالأمان والدفء. لكن في يوم من الأيام، بدأت تشعر بشيء غريب...',
        en: 'Under the warm soil, a little seed was sleeping. She was surrounded by moist soil, feeling safe and warm. But one day, she began to feel something strange...',
        illustration: '🌰',
        bgGradient: 'from-amber-50 to-yellow-100',
      },
      {
        ar: 'قالت البذرة لنفسها: "أشعر بأنني أريد أن أكبر! أريد أن أخرج من هذه التربة وأرى الشمس!" لكنها خافت، فالخارج مجهول بالنسبة لها.',
        en: 'The seed said to herself: "I feel like I want to grow! I want to come out of this soil and see the sun!" But she was afraid, for the outside was unknown to her.',
        illustration: '🌱',
        bgGradient: 'from-green-50 to-emerald-100',
      },
      {
        ar: 'سمعت البذرة صوت المطر يقول: "لا تخافي يا صغيرتي، أنا هنا أسقيك وأمنحك القوة للنمو". شعرت البذرة ببعض الطمأنينة.',
        en: 'The seed heard the rain\'s voice saying: "Don\'t be afraid little one, I\'m here to water you and give you strength to grow." The seed felt some reassurance.',
        illustration: '🌧️',
        bgGradient: 'from-blue-50 to-cyan-100',
      },
      {
        ar: 'ثم سمعت صوت الشمس الدافئ يقول: "أنا أنتظرك يا بذرتي الصغيرة! اخرجي لأعطيكِ النور والدفء، فبدوني لا تستطيعين النمو".',
        en: 'Then she heard the warm sun\'s voice saying: "I\'m waiting for you my little seed! Come out so I can give you light and warmth, for without me you cannot grow."',
        illustration: '☀️',
        bgGradient: 'from-yellow-50 to-orange-100',
      },
      {
        ar: 'جمعت البذرة شجاعتها وبدأت تدفع التربة للأعلى. كان الأمر صعباً، لكنها لم تستسلم. أخيراً، خرج رأسها الصغير أخضر إلى النور!',
        en: 'The seed gathered her courage and began pushing the soil upward. It was difficult, but she didn\'t give up. Finally, her little green head emerged into the light!',
        illustration: '🌿',
        bgGradient: 'from-green-50 to-teal-100',
      },
      {
        ar: 'يا له من عالم جميل! رأت البذرة السماء الزرقاء، والأشجار الكبيرة، والعصافير الملونة. شعرت بسعادة غامرة وهي تشعر بدفء الشمس على أوراقها الصغيرة.',
        en: 'What a beautiful world! The seed saw the blue sky, the big trees, and the colorful birds. She felt overwhelming happiness as she felt the sun\'s warmth on her little leaves.',
        illustration: '🌳',
        bgGradient: 'from-emerald-50 to-green-100',
      },
      {
        ar: 'مرّت الأيام، وكبرت البذرة الصغيرة. أصبحت نبتة، ثم شجيرة، ثم شجرة كبيرة ذات أغصان قوية وأوراق خضراء كثيفة.',
        en: 'Days passed, and the little seed grew. She became a plant, then a shrub, then a big tree with strong branches and dense green leaves.',
        illustration: '🌲',
        bgGradient: 'from-teal-50 to-emerald-100',
      },
      {
        ar: 'في يوم، جاء طفل صغير وجلس تحت ظلّها. قال: "ما أجمل هذه الشجرة! تظللني من الشمس وتعطيني ثماراً لذيذة". فرحت الشجرة كثيراً.',
        en: 'One day, a little child came and sat under her shade. He said: "How beautiful this tree is! It shades me from the sun and gives me delicious fruits." The tree was very happy.',
        illustration: '🍎',
        bgGradient: 'from-rose-50 to-red-100',
      },
      {
        ar: 'فهمت الشجرة أن خوفها من النمو كان بلا معنى. لو بقيت بذرة صغيرة تحت التربة، لما استطاعت أن تفيد أحداً. لكنها حين كبرت، أصبحت مصدر خير للكثيرين.',
        en: 'The tree understood that her fear of growing was meaningless. If she had stayed a little seed under the soil, she couldn\'t have helped anyone. But when she grew, she became a source of goodness for many.',
        illustration: '🌈',
        bgGradient: 'from-green-50 to-emerald-100',
      },
      {
        ar: 'هكذا، كل واحد منا كبذرة صغيرة في الحياة. إذا تغلّبنا على خوفنا ونمونا، نصبح أشجاراً كبيرة تثمر الخير للجميع.',
        en: 'Thus, each of us is like a little seed in life. If we overcome our fear and grow, we become big trees that bear goodness for all.',
        illustration: '✨',
        bgGradient: 'from-amber-50 to-yellow-100',
      },
    ],
    lessonAr: 'لا تخف من النمو والتغيير. الشجاعة والصبر يحوّلانك من بذرة صغيرة إلى شجرة كبيرة تنفع نفسها والآخرين.',
    lessonEn: 'Don\'t be afraid to grow and change. Courage and patience transform you from a little seed to a big tree that benefits yourself and others.',
    tagsAr: ['شجاعة', 'صبر', 'نمو', 'طبيعة'],
    tagsEn: ['Courage', 'Patience', 'Growth', 'Nature'],
  },
]

export function getStoryById(id: string): Story | undefined {
  return stories.find(s => s.id === id)
}

export function getStoriesByCategory(category: string): Story[] {
  if (category === 'all') return stories
  return stories.filter(s => s.category === category)
}

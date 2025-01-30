// ビュー管理
let currentView = 'home';
let selectedCourseId = null;

// コース開始
function startCourse(courseId) {
    selectedCourseId = courseId;
    
    // コースが未開始の場合は初期化
    if (!learningData.courseProgress[courseId]) {
        courseManager.initializeCourse(courseId);
    }
    
    // コースビューを表示
    showView('course');
    
    // コースの状態を表示に反映
    updateCourseDisplay(courseId);
}

// コース選択画面を表示
function showCourseSelection() {
    document.getElementById('course-selection-view').style.display = 'block';
    document.getElementById('action-view').style.display = 'none';
    currentView = 'course-selection';
    
    // ナビゲーションの状態を更新
    updateNavigation();
}

// アクション実行画面を表示
function showActionView() {
    document.getElementById('course-selection-view').style.display = 'none';
    document.getElementById('action-view').style.display = 'block';
    currentView = 'action';
    
    // ナビゲーションの状態を更新
    updateNavigation();
}

// ナビゲーションの状態を更新
function updateNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        const view = item.dataset.view;
        if (view === currentView) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// お知らせデータ
const notifications = {
    1: {
        id: 1,
        title: "新しいコース「AIアプリケーション開発」が追加されました",
        type: "新着コース",
        date: "2024年5月7日",
        body: `新しいコース「AIアプリケーション開発」が追加されました。

このコースでは、最新のAI技術を活用したアプリケーション開発について学ぶことができます。

主な学習内容：
・機械学習の基礎
・深層学習フレームワークの使い方
・AIアプリケーションの設計と実装
・デプロイメントとスケーリング

ぜひチャレンジしてみてください！`,
        isRead: false
    },
    2: {
        id: 2,
        title: "コース「プログラミング入門」の内容が更新されました",
        type: "アップデート",
        date: "2024年4月30日",
        body: `コース「プログラミング入門」の内容が更新され、より分かりやすい説明と実践的な演習が追加されました。

主な更新内容：
・説明の改善と図解の追加
・実践演習の拡充
・最新の開発環境への対応
・新しいプロジェクト課題の追加

既に受講中の方も、新しい内容をご確認いただけます。`,
        isRead: false
    }
};

// データ永続化のための関数
const storage = {
    save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    load: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

// 学習データの管理
const learningData = {
    progress: storage.load('learning_progress') || {
        totalProgress: 0,
        totalHours: 0,
        completedCourses: 0,
        questionCount: 0
    },
    lastCourse: storage.load('last_course') || null,
    courseProgress: storage.load('course_progress') || {},

    // 進捗を更新
    updateProgress: function(data) {
        this.progress = { ...this.progress, ...data };
        storage.save('learning_progress', this.progress);
    },

    // 最後に学習したコースを更新
    updateLastCourse: function(courseId) {
        this.lastCourse = courseId;
        storage.save('last_course', courseId);
    },

    // コースの進捗を更新
    updateCourseProgress: function(courseId, progress) {
        this.courseProgress[courseId] = progress;
        storage.save('course_progress', this.courseProgress);
    }
};

// 通知データの管理
const notificationData = {
    notifications: storage.load('notifications') || notifications,
    
    // 既読状態を更新
    markAsRead: function(id) {
        if (this.notifications[id]) {
            this.notifications[id].isRead = true;
            storage.save('notifications', this.notifications);
        }
    },

    // すべて既読にする
    markAllAsRead: function() {
        Object.values(this.notifications).forEach(notification => {
            notification.isRead = true;
        });
        storage.save('notifications', this.notifications);
    }
};

// コースデータ
const courses = {
    'programming-basics': {
        id: 'programming-basics',
        title: 'プログラミング入門',
        level: '初級',
        description: 'プログラミングの基礎を学び、簡単なアプリケーションを作成できるようになります。',
        totalHours: 20,
        steps: [
            {
                id: 'step1',
                title: '環境構築',
                description: '開発環境のセットアップと基本的なツールのインストール',
                status: 'locked',
                requiredTime: 2
            },
            {
                id: 'step2',
                title: '基本概念の理解',
                description: 'プログラミングの基本的な概念と考え方を学習',
                status: 'locked',
                requiredTime: 8
            },
            {
                id: 'step3',
                title: '実践演習',
                description: '実際のプロジェクトを通じて学んだ内容を実践',
                status: 'locked',
                requiredTime: 10
            }
        ]
    },
    'data-science': {
        id: 'data-science',
        title: 'データサイエンス基礎',
        level: '中級',
        description: 'データ分析の基礎を学び、実践的なデータサイエンススキルを習得します。',
        totalHours: 30,
        steps: [
            {
                id: 'step1',
                title: 'データ分析入門',
                description: 'データ分析の基本概念と統計の基礎',
                status: 'locked',
                requiredTime: 5
            },
            {
                id: 'step2',
                title: 'Pythonによるデータ処理',
                description: 'Pythonを使用したデータの前処理と加工',
                status: 'locked',
                requiredTime: 10
            },
            {
                id: 'step3',
                title: '機械学習の基礎',
                description: '基本的な機械学習アルゴリズムの理解と実装',
                status: 'locked',
                requiredTime: 15
            }
        ]
    },
    'web-development': {
        id: 'web-development',
        title: 'Webアプリケーション開発',
        level: '中級',
        description: 'モダンなWebアプリケーション開発の手法を学びます。',
        totalHours: 40,
        steps: [
            {
                id: 'step1',
                title: 'フロントエンド基礎',
                description: 'HTML, CSS, JavaScriptの基本',
                status: 'locked',
                requiredTime: 10
            },
            {
                id: 'step2',
                title: 'バックエンド開発',
                description: 'サーバーサイドプログラミングとデータベース',
                status: 'locked',
                requiredTime: 15
            },
            {
                id: 'step3',
                title: 'フルスタック開発',
                description: 'フロントエンドとバックエンドの統合',
                status: 'locked',
                requiredTime: 15
            }
        ]
    },
    'ai-basics': {
        id: 'ai-basics',
        title: 'AI・機械学習入門',
        level: '中級',
        description: 'AI・機械学習の基礎から実践までを学びます。',
        totalHours: 35,
        steps: [
            {
                id: 'step1',
                title: 'AI基礎理論',
                description: 'AIの基本概念と理論的背景',
                status: 'locked',
                requiredTime: 10
            },
            {
                id: 'step2',
                title: '機械学習実践',
                description: '代表的な機械学習アルゴリズムの実装',
                status: 'locked',
                requiredTime: 15
            },
            {
                id: 'step3',
                title: 'ディープラーニング入門',
                description: 'ニューラルネットワークの基礎と実装',
                status: 'locked',
                requiredTime: 10
            }
        ]
    },
    'mobile-app': {
        id: 'mobile-app',
        title: 'モバイルアプリ開発',
        level: '中級',
        description: 'iOSとAndroidアプリの開発手法を学びます。',
        totalHours: 45,
        steps: [
            {
                id: 'step1',
                title: 'モバイル開発基礎',
                description: 'モバイルアプリ開発の基本概念',
                status: 'locked',
                requiredTime: 10
            },
            {
                id: 'step2',
                title: 'iOS開発',
                description: 'SwiftによるiOSアプリ開発',
                status: 'locked',
                requiredTime: 15
            },
            {
                id: 'step3',
                title: 'Android開発',
                description: 'KotlinによるAndroidアプリ開発',
                status: 'locked',
                requiredTime: 20
            }
        ]
    },
    'cloud-computing': {
        id: 'cloud-computing',
        title: 'クラウドコンピューティング',
        level: '上級',
        description: 'クラウドサービスの活用と運用管理を学びます。',
        totalHours: 40,
        steps: [
            {
                id: 'step1',
                title: 'クラウド基礎',
                description: 'クラウドコンピューティングの基本概念',
                status: 'locked',
                requiredTime: 10
            },
            {
                id: 'step2',
                title: 'AWS実践',
                description: 'AWSの主要サービスの活用方法',
                status: 'locked',
                requiredTime: 15
            },
            {
                id: 'step3',
                title: 'クラウドアーキテクチャ',
                description: 'スケーラブルなシステム設計',
                status: 'locked',
                requiredTime: 15
            }
        ]
    },
    'security': {
        id: 'security',
        title: 'サイバーセキュリティ',
        level: '上級',
        description: '情報セキュリティの基礎から実践的な対策まで学びます。',
        totalHours: 35,
        steps: [
            {
                id: 'step1',
                title: 'セキュリティ基礎',
                description: '情報セキュリティの基本概念',
                status: 'locked',
                requiredTime: 10
            },
            {
                id: 'step2',
                title: '脆弱性診断',
                description: 'セキュリティ診断と対策',
                status: 'locked',
                requiredTime: 15
            },
            {
                id: 'step3',
                title: 'インシデント対応',
                description: 'セキュリティインシデントへの対応',
                status: 'locked',
                requiredTime: 10
            }
        ]
    },
    'devops': {
        id: 'devops',
        title: 'DevOps実践',
        level: '上級',
        description: '継続的インテグレーション/デリバリーの実践を学びます。',
        totalHours: 40,
        steps: [
            {
                id: 'step1',
                title: 'DevOps概論',
                description: 'DevOpsの基本概念と文化',
                status: 'locked',
                requiredTime: 10
            },
            {
                id: 'step2',
                title: 'CI/CD実践',
                description: '自動化パイプラインの構築',
                status: 'locked',
                requiredTime: 15
            },
            {
                id: 'step3',
                title: 'モニタリング',
                description: 'システム監視と運用管理',
                status: 'locked',
                requiredTime: 15
            }
        ]
    },
    'blockchain': {
        id: 'blockchain',
        title: 'ブロックチェーン開発',
        level: '上級',
        description: 'ブロックチェーン技術とスマートコントラクトの開発を学びます。',
        totalHours: 45,
        steps: [
            {
                id: 'step1',
                title: 'ブロックチェーン基礎',
                description: 'ブロックチェーンの基本概念',
                status: 'locked',
                requiredTime: 15
            },
            {
                id: 'step2',
                title: 'スマートコントラクト',
                description: 'Solidityによるスマートコントラクト開発',
                status: 'locked',
                requiredTime: 15
            },
            {
                id: 'step3',
                title: 'DApp開発',
                description: '分散型アプリケーションの開発',
                status: 'locked',
                requiredTime: 15
            }
        ]
    }
};

// コース管理機能を拡張
const courseManager = {
    // コースの進捗状態を初期化
    initializeCourse: function(courseId) {
        const course = courses[courseId];
        if (!course) return;

        // 最初のステップのみアンロック
        course.steps[0].status = 'in-progress';
        for (let i = 1; i < course.steps.length; i++) {
            course.steps[i].status = 'locked';
        }

        // 進捗データを保存
        learningData.updateLastCourse(courseId);
        learningData.updateCourseProgress(courseId, {
            currentStep: 0,
            completedSteps: [],
            totalProgress: 0
        });

        return course;
    },

    // ステップの完了
    completeStep: function(courseId, stepId) {
        const course = courses[courseId];
        if (!course) return;

        const stepIndex = course.steps.findIndex(step => step.id === stepId);
        if (stepIndex === -1) return;

        // 現在のステップを完了状態に
        course.steps[stepIndex].status = 'completed';

        // 次のステップがあれば、それを進行中に
        if (stepIndex + 1 < course.steps.length) {
            course.steps[stepIndex + 1].status = 'in-progress';
        }

        // 進捗データを更新
        const progress = learningData.courseProgress[courseId] || { completedSteps: [], totalProgress: 0 };
        progress.completedSteps.push(stepId);
        progress.currentStep = stepIndex + 1;
        progress.totalProgress = (progress.completedSteps.length / course.steps.length) * 100;

        learningData.updateCourseProgress(courseId, progress);

        // 全体の進捗も更新
        this.updateTotalProgress();

        return course;
    },

    // 全体の進捗を更新
    updateTotalProgress: function() {
        const totalCourses = Object.keys(courses).length;
        let completedCourses = 0;
        let totalProgress = 0;
        let totalHours = 0;

        Object.keys(courses).forEach(courseId => {
            const progress = learningData.courseProgress[courseId];
            if (progress) {
                totalProgress += progress.totalProgress;
                if (progress.totalProgress === 100) {
                    completedCourses++;
                }
                // 完了したステップの学習時間を計算
                const course = courses[courseId];
                progress.completedSteps.forEach(stepId => {
                    const step = course.steps.find(s => s.id === stepId);
                    if (step) {
                        totalHours += step.requiredTime;
                    }
                });
            }
        });

        // 全体の進捗を更新
        learningData.updateProgress({
            totalProgress: Math.round(totalProgress / totalCourses),
            totalHours: totalHours,
            completedCourses: completedCourses
        });
    }
};

// コースの表示を更新
function updateCourseDisplay(courseId) {
    const course = courses[courseId];
    const progress = learningData.courseProgress[courseId];
    if (!course || !progress) return;

    // コースタイトルを更新
    const courseTitle = document.querySelector('#course-view .content-header h1');
    if (courseTitle) {
        courseTitle.textContent = course.title;
    }

    // プログレスバーを更新
    const progressBar = document.querySelector('#course-view .progress');
    if (progressBar) {
        progressBar.style.width = `${progress.totalProgress}%`;
    }
    
    const progressInfo = document.querySelector('#course-view .progress-info');
    if (progressInfo) {
        progressInfo.textContent = `${Math.round(progress.totalProgress)}% 完了`;
    }

    // ステップの状態を更新
    const stepsContainer = document.querySelector('#course-view .action-steps');
    if (stepsContainer) {
        stepsContainer.innerHTML = course.steps.map((step, index) => `
            <div class="step-card ${step.status === 'in-progress' ? 'active' : ''}">
                <div class="step-header">
                    <h3>${step.title}</h3>
                    <span class="step-status ${step.status}">${
                        step.status === 'completed' ? '完了' :
                        step.status === 'in-progress' ? '進行中' : '未開始'
                    }</span>
                </div>
                <p>${step.description}</p>
                ${step.status === 'in-progress' ? `
                    <button class="action-button" onclick="completeStep('${courseId}', '${step.id}')">
                        完了してNext Step
                    </button>
                ` : ''}
            </div>
        `).join('');
    }

    // 最近の活動に追加
    activityData.addActivity({
        title: course.title,
        subtitle: `${course.steps[progress.currentStep]?.title || 'コース開始'}`,
        type: 'course'
    });
}

// ステップ完了処理
function completeStep(courseId, stepId) {
    courseManager.completeStep(courseId, stepId);
    updateCourseDisplay(courseId);
}

// 質問データ
const questionData = {
    questions: storage.load('questions') || {
        1: {
            id: 1,
            title: "環境構築でエラーが発生します",
            content: "Node.jsのインストール時にエラーが表示されます。対処方法を教えてください。",
            courseId: 'programming-basics',
            status: 'answered',
            date: "2024年5月1日",
            answer: "Node.jsの公式サイトから最新版をダウンロードして、インストールし直してみてください。",
            answerDate: "2024年5月2日"
        },
        2: {
            id: 2,
            title: "データの前処理について質問があります",
            content: "欠損値の処理方法について、最適な方法を教えていただけますか？",
            courseId: 'data-science',
            status: 'pending',
            date: "2024年5月5日"
        }
    },

    // 質問を追加
    addQuestion: function(question) {
        const id = Date.now();
        this.questions[id] = {
            id,
            ...question,
            date: new Date().toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            status: 'pending'
        };
        storage.save('questions', this.questions);
        return id;
    },

    // 質問に回答
    answerQuestion: function(id, answer) {
        if (this.questions[id]) {
            this.questions[id].answer = answer;
            this.questions[id].status = 'answered';
            this.questions[id].answerDate = new Date().toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            storage.save('questions', this.questions);
        }
    }
};

// 最近の活動データ
const activityData = {
    activities: storage.load('activities') || [],

    // 活動を追加
    addActivity: function(activity) {
        this.activities.unshift({
            id: Date.now(),
            ...activity,
            date: new Date().toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        });
        
        // 最大10件まで保持
        if (this.activities.length > 10) {
            this.activities.pop();
        }
        
        storage.save('activities', this.activities);
        this.updateActivityDisplay();
    },

    // 活動表示を更新
    updateActivityDisplay: function() {
        const container = document.getElementById('recent-activities');
        if (!container) return;

        container.innerHTML = this.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-subtitle">${activity.subtitle || ''}</div>
                    <div class="activity-time">${activity.date}</div>
                </div>
            </div>
        `).join('');
    }
};

// サムネイル画像のマッピング
const courseThumbnails = {
    'programming-basics': 'https://utagesystem.s3.ap-northeast-1.amazonaws.com/GYbKT7Y9d0eR/site/6a481X2SSRhF/XmufWAq4RLivvulNY58n9DkH7ApooudfOopy8x32.jpg',
    'data-science': 'https://utagesystem.s3.ap-northeast-1.amazonaws.com/GYbKT7Y9d0eR/site/6a481X2SSRhF/b63AP2okoNUVz8eoIw1F0XGlEOIvVGrq8bMSZwmh.jpg',
    'web-development': 'https://utagesystem.s3.ap-northeast-1.amazonaws.com/GYbKT7Y9d0eR/site/6a481X2SSRhF/8OARGLWGLNM99JoJdGRLy8qqCO1OksrU6Ihn1QHG.jpg',
    'ai-basics': 'https://utagesystem.s3.ap-northeast-1.amazonaws.com/GYbKT7Y9d0eR/site/6a481X2SSRhF/yK7vHrjPY97meNOU5EbmD6wn73o7VfJCJfPHbmXs.jpg',
    'mobile-app': 'https://utagesystem.s3.ap-northeast-1.amazonaws.com/GYbKT7Y9d0eR/site/6a481X2SSRhF/n9lBtvPaHM07vPqJSnhM4NZuH0Krd5MZ9IEivBuR.jpg',
    'cloud-computing': 'https://utagesystem.s3.ap-northeast-1.amazonaws.com/GYbKT7Y9d0eR/site/6a481X2SSRhF/o0plGHkiS5Q0OjP8FbCUNuXd2U6ueK5b9NMy9jXU.jpg',
    'security': 'https://utagesystem.s3.ap-northeast-1.amazonaws.com/GYbKT7Y9d0eR/site/6a481X2SSRhF/e1bBmEVoXH2MSAOVqFXP0g6V0cJicsoNPvdlBtRj.jpg',
    'devops': 'https://utagesystem.s3.ap-northeast-1.amazonaws.com/GYbKT7Y9d0eR/site/6a481X2SSRhF/w4ZnkKvZaZe88JNzO5M2H94yrPSTCwfVkmirBEui.jpg',
    'blockchain': 'https://utagesystem.s3.ap-northeast-1.amazonaws.com/GYbKT7Y9d0eR/site/6a481X2SSRhF/69BPcYLNFKBOo6s6baoy2cr72T6TgS0Kl9T6lyQp.jpg'
};

// ダッシュボード更新
function updateDashboard() {
    // 統計情報の更新
    const totalProgress = document.getElementById('total-progress');
    const totalHours = document.getElementById('total-hours');
    const completedCourses = document.getElementById('completed-courses');
    const questionCount = document.getElementById('question-count');

    if (totalProgress) totalProgress.textContent = `${learningData.progress.totalProgress}`;
    if (totalHours) totalHours.textContent = `${learningData.progress.totalHours}`;
    if (completedCourses) completedCourses.textContent = learningData.progress.completedCourses;
    if (questionCount) questionCount.textContent = Object.keys(questionData.questions).length;

    // 続きから学習の更新
    const continuelearning = document.getElementById('continue-learning');
    if (continuelearning) {
        const inProgressCourses = Object.entries(learningData.courseProgress)
            .filter(([_, progress]) => progress.totalProgress > 0 && progress.totalProgress < 100)
            .sort((a, b) => b[1].lastAccessed - a[1].lastAccessed);

        if (inProgressCourses.length > 0) {
            continuelearning.innerHTML = inProgressCourses
                .map(([courseId, progress]) => {
                    const course = courses[courseId];
                    if (!course) return '';
                    const thumbnailUrl = courseThumbnails[courseId] || 'https://placehold.co/800x400/0891b2/ffffff?text=クラウド';
                    return `
                        <div class="course-card">
                            <img src="${thumbnailUrl}" alt="${course.title}" class="course-thumbnail">
                            <div class="course-card-content">
                                <div class="course-card-header">
                                    <h2>${course.title}</h2>
                                </div>
                                <div class="progress-info">
                                    進捗率: ${Math.round(progress.totalProgress)}%
                                </div>
                                <button class="course-button" onclick="startCourse('${course.id}')">
                                    進む
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
        } else {
            continuelearning.innerHTML = `
                <div class="empty-state">
                    <p class="empty-state-text">まだ開始しているコースはありません</p>
                    <p class="empty-state-subtext">チュートリアルを見ながら、<br>システムの使い方を学んでいきましょう。</p>
                    <button class="empty-state-button" onclick="startTutorial()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        チュートリアルを開始
                    </button>
                </div>
            `;
        }
    }

    // コース一覧の更新
    const courseList = document.getElementById('course-list');
    if (courseList) {
        courseList.innerHTML = Object.values(courses)
            .filter(course => !learningData.courseProgress[course.id] || learningData.courseProgress[course.id].totalProgress === 0)
            .map(course => {
                const thumbnailUrl = courseThumbnails[course.id] || 'https://placehold.co/800x400/0891b2/ffffff?text=クラウド';
                return `
                    <div class="course-card">
                        <img src="${thumbnailUrl}" alt="${course.title}" class="course-thumbnail">
                        <div class="course-card-content">
                            <div class="course-card-header">
                                <h2>${course.title}</h2>
                            </div>
                            <p class="course-description">${course.description}</p>
                            <div class="course-info">
                                <div class="course-stat">
                                    <svg class="course-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    所要時間: ${course.totalHours}時間
                                </div>
                            </div>
                            <button class="course-button" onclick="startCourse('${course.id}')">
                                はじめる
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
    }
}

// 質問一覧の表示を更新
function updateQuestionList(filters = {}) {
    const container = document.getElementById('questions-container');
    if (!container) return;

    const filteredQuestions = Object.values(questionData.questions)
        .filter(q => {
            if (filters.status && filters.status !== 'all') {
                if (q.status !== filters.status) return false;
            }
            if (filters.courseId && filters.courseId !== 'all') {
                if (q.courseId !== filters.courseId) return false;
            }
            return true;
        });

    container.innerHTML = filteredQuestions.map(question => `
        <div class="question-item" data-id="${question.id}">
            <div class="question-header">
                <h3 class="question-title">${question.title}</h3>
                <div class="question-meta">
                    <span class="question-course">${courses[question.courseId]?.title || '不明なコース'}</span>
                    <span class="question-status ${question.status}">
                        ${question.status === 'answered' ? '回答済み' : '未回答'}
                    </span>
                </div>
            </div>
            <p class="question-content">${question.content}</p>
            <div class="question-footer">
                <span>${question.date}</span>
                ${question.answerDate ? `<span>回答日: ${question.answerDate}</span>` : ''}
            </div>
        </div>
    `).join('');

    // 質問アイテムのクリックイベントを設定
    container.querySelectorAll('.question-item').forEach(item => {
        item.addEventListener('click', () => {
            showQuestionDetail(item.dataset.id);
        });
    });
}

// 質問詳細を表示
function showQuestionDetail(id) {
    const question = questionData.questions[id];
    if (!question) return;

    const modal = document.getElementById('question-detail-modal');
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = `
        <div class="question-detail">
            <div class="question-meta">
                <span class="question-course">${courses[question.courseId]?.title || '不明なコース'}</span>
                <span class="question-status ${question.status}">
                    ${question.status === 'answered' ? '回答済み' : '未回答'}
                </span>
            </div>
            <h3 class="question-title">${question.title}</h3>
            <p class="question-content">${question.content}</p>
            <div class="question-date">${question.date}</div>
            ${question.answer ? `
                <div class="answer-section">
                    <h4>回答</h4>
                    <p>${question.answer}</p>
                    <div class="answer-date">回答日: ${question.answerDate}</div>
                </div>
            ` : ''}
        </div>
    `;

    modal.classList.add('is-visible');
}

// お知らせの既読/未読状態を切り替える関数
function toggleReadStatus() {
    if (!currentNotificationId) return;

    const notification = notificationData.notifications[currentNotificationId];
    if (!notification) return;

    // 既読状態を切り替え
    notification.isRead = !notification.isRead;
    
    // ストレージに保存
    notificationData.notifications[currentNotificationId] = notification;
    storage.save('notifications', notificationData.notifications);

    // UIを更新
    const notificationItem = document.querySelector(`.notification-item[data-id="${currentNotificationId}"]`);
    if (notificationItem) {
        notificationItem.classList.toggle('unread', !notification.isRead);
    }

    // ボタンのテキストを更新
    const markAsReadButton = document.querySelector('.mark-as-read-button');
    if (markAsReadButton) {
        markAsReadButton.textContent = notification.isRead ? '未読にする' : '既読にする';
    }

    // 未読カウントを更新
    updateUnreadCount();
}

// ビューの切り替え機能
function switchView(viewId) {
    console.log('Switching to view:', viewId); // デバッグ用
    
    // すべてのビューを非表示
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none';
    });
    
    // 指定されたビューを表示
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        targetView.style.display = 'block';
        console.log('View found and activated:', viewId); // デバッグ用

        // ビューに応じた追加の更新処理
        if (viewId === 'questions-view') {
            updateQuestionList();
        } else if (viewId === 'notifications-view') {
            initializeNotifications();
        }
    } else {
        console.log('View not found:', viewId); // デバッグ用
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const sideNav = document.querySelector('.side-nav');
    const overlay = document.querySelector('.overlay');
    const menuButton = document.getElementById('menu-toggle');

    // ハンバーガーメニューの制御
    function toggleMenu() {
        console.log('Toggle menu clicked'); // デバッグ用
        sideNav.classList.toggle('is-visible');
        overlay.classList.toggle('is-visible');
        document.body.style.overflow = sideNav.classList.contains('is-visible') ? 'hidden' : '';
    }

    // メニューボタンのクリックイベント
    if (menuButton) {
        menuButton.addEventListener('click', toggleMenu);
        console.log('Menu button event listener added'); // デバッグ用
    }

    // オーバーレイのクリックイベント
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (sideNav.classList.contains('is-visible')) {
                toggleMenu();
            }
        });
    }

    // メニュー項目のクリックイベント
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // href属性から対象のビューIDを取得
            const targetView = item.getAttribute('href').substring(1);
            console.log('Nav item clicked, target:', targetView); // デバッグ用
            
            // ビューを切り替え
            switchView(targetView);

            // アクティブなメニュー項目のスタイルを更新
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            item.classList.add('active');

            // スマートフォンでメニューを閉じる
            if (window.innerWidth <= 1024) {
                setTimeout(() => {
                    sideNav.classList.remove('is-visible');
                    overlay.classList.remove('is-visible');
                    document.body.style.overflow = '';
                }, 100);
            }
        });
    });

    // 画面リサイズ時の処理
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            sideNav.classList.remove('is-visible');
            overlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        }
    });

    // 初期表示の設定（ホーム画面を表示）
    switchView('home-view');
    document.querySelector('.nav-item[href="#home-view"]')?.classList.add('active');

    // 初期データの更新
    updateDashboard();
    updateQuestionList();
    activityData.updateActivityDisplay();
    updateUnreadCount();
});

// お知らせの初期化
function initializeNotifications() {
    const container = document.querySelector('.notification-list');
    if (!container) return;

    container.innerHTML = Object.values(notificationData.notifications)
        .map(notification => `
            <div class="notification-item ${notification.isRead ? '' : 'unread'}" data-id="${notification.id}">
                <div class="notification-item-header">
                    <span class="status-badge">${notification.type}</span>
                </div>
                <h3 class="notification-title">${notification.title}</h3>
                <div class="notification-meta">
                    <div class="notification-date">${notification.date}</div>
                </div>
            </div>
        `).join('');

    // クリックイベントの設定
    container.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', () => {
            showNotificationDetail(item.dataset.id);
        });
    });
}

// メッセージの初期化
function initializeMessages() {
    const container = document.querySelector('.message-list');
    if (!container) return;

    // サンプルデータを使用
    const messages = [
        {
            id: 1,
            sender: 'システム管理者',
            preview: 'コースの進捗について確認したい点があります',
            time: '13:45',
            unread: 2
        },
        {
            id: 2,
            sender: 'メンター 山田',
            preview: '次回の面談の日程を調整させていただきたく...',
            time: '昨日',
            unread: 0
        }
    ];

    container.innerHTML = messages.map(message => `
        <div class="message-item ${message.unread ? 'unread' : ''}" data-id="${message.id}">
            <div class="message-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4M12 8h.01"></path>
                </svg>
            </div>
            <div class="message-content">
                <div class="message-sender">${message.sender}</div>
                <div class="message-preview">${message.preview}</div>
                <div class="message-meta">
                    <span class="message-time">${message.time}</span>
                    ${message.unread ? `<span class="unread-count">${message.unread}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    // クリックイベントの設定
    container.querySelectorAll('.message-item').forEach(item => {
        item.addEventListener('click', () => {
            showMessageDetail(item.dataset.id);
        });
    });
}

// 未読数を更新する関数
function updateUnreadCount() {
    // お知らせの未読数を更新
    const unreadCount = Object.values(notificationData.notifications).filter(n => !n.isRead).length;
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    // 質問の未回答数を更新
    const pendingQuestions = Object.values(questionData.questions).filter(q => q.status === 'pending').length;
    const questionBadge = document.querySelector('.question-badge');
    if (questionBadge) {
        questionBadge.textContent = pendingQuestions;
        questionBadge.style.display = pendingQuestions > 0 ? 'flex' : 'none';
    }

    // メッセージバッジの更新（仮の実装）
    const messageBadge = document.querySelector('.message-badge');
    if (messageBadge) {
        messageBadge.style.display = 'flex';
    }
}

// お知らせ詳細を表示する関数
function showNotificationDetail(id) {
    const notification = notificationData.notifications[id];
    if (!notification) return;

    // 以前の選択を解除
    document.querySelectorAll('.notification-item.selected').forEach(item => {
        item.classList.remove('selected');
    });

    // 新しい選択を設定
    const selectedItem = document.querySelector(`.notification-item[data-id="${id}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }

    currentNotificationId = id;
    
    // 詳細内容を設定
    const detail = document.getElementById('notification-detail');
    if (detail) {
        detail.querySelector('.status-badge').textContent = notification.type;
        detail.querySelector('.notification-date').textContent = notification.date;
        detail.querySelector('.notification-detail-title').textContent = notification.title;
        detail.querySelector('.notification-detail-body').textContent = notification.body;
    }

    // 既読/未読ボタンの状態を更新
    const markAsReadButton = document.querySelector('.mark-as-read-button');
    if (markAsReadButton) {
        markAsReadButton.textContent = notification.isRead ? '未読にする' : '既読にする';
    }

    // モバイル表示の場合は詳細ビューを表示
    if (window.innerWidth <= 768) {
        detail.classList.add('is-visible');
    }
}

// チュートリアル機能
function startTutorial() {
    // チュートリアルの状態を管理
    const tutorialState = {
        currentStep: 0,
        steps: [
            {
                title: 'アクションを進め、新たなスキルを獲得しましょう',
                description: '学習の進捗状況や統計情報を確認できます。',
                target: '.progress-overview'
            },
            {
                title: 'コース一覧の確認',
                description: '様々な分野のコースから興味のあるものを選択できます。',
                target: '.course-grid'
            },
            {
                title: '質問機能の利用',
                description: '分からないことがあれば、いつでも質問することができます。',
                target: '#questions-view'
            }
        ]
    };

    // チュートリアルの進行状態をローカルストレージに保存
    storage.save('tutorial_state', tutorialState);

    // 最初のステップを表示
    showTutorialStep(0);
}

// チュートリアルステップの表示
function showTutorialStep(stepIndex) {
    const tutorialState = storage.load('tutorial_state');
    if (!tutorialState || stepIndex >= tutorialState.steps.length) return;

    const step = tutorialState.steps[stepIndex];
    const target = document.querySelector(step.target);
    if (!target) return;

    // ハイライト要素の作成
    const highlight = document.createElement('div');
    highlight.className = 'tutorial-highlight';
    target.appendChild(highlight);

    // 説明テキストの表示
    const tooltip = document.createElement('div');
    tooltip.className = 'tutorial-tooltip';
    tooltip.innerHTML = `
        <h3>${step.title}</h3>
        <p>${step.description}</p>
        <div class="tutorial-actions">
            ${stepIndex > 0 ? `
                <button class="tutorial-prev" onclick="showTutorialStep(${stepIndex - 1})">
                    前へ
                </button>
            ` : ''}
            <button class="tutorial-next" onclick="showTutorialStep(${stepIndex + 1})">
                ${stepIndex < tutorialState.steps.length - 1 ? '次へ' : '完了'}
            </button>
        </div>
    `;
    target.appendChild(tooltip);

    // スクロール位置の調整
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
} 
/**
 * MOTOSU AGENCIES - Tasks Module
 * Gestion des tâches interactives
 */

function openTask(taskId) {
  const task = state.tasks.find(t => getId(t) === taskId);
  if (!task) return;
  state.currentTask = task;
  state.surveyAnswers = {};
  $('#modal').innerHTML = renderTaskModal(task);
}

function renderTaskModal(task) {
  let content = '';
  const taskId = getId(task);

  if (task.type === 'sondage') {
    content = `
      <div id="surveyContainer">
        ${task.content.questions.map((q, i) => `
          <div class="question-container" id="question-${i}">
            <p class="question-title">${i + 1}. ${q.question}</p>
            <div class="space-y-2">
              ${q.options.map((opt, j) => `
                <button type="button" class="option-btn" data-question="${i}" data-option="${j}"
                  onclick="selectOption(${i}, ${j}, '${opt.replace(/'/g, "\\'")}')">
                  ${opt}
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <div id="surveyProgress" class="mt-4 p-3 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-800">Réponses: <span id="answeredCount">0</span>/${task.content.questions.length}</p>
      </div>
    `;
  } else if (task.type === 'verification') {
    content = `
      <div class="mb-4 p-3 bg-blue-50 rounded-lg"><p class="text-sm text-blue-800">${task.content.instruction}</p></div>
      <div class="space-y-2" id="verificationItems">
        ${task.content.items.map((item, i) => `
          <div class="check-item" data-index="${i}" onclick="toggleCheck(this, ${i})">
            <span class="flex-1">${item.text}</span>
            <span class="checkmark text-xl ml-2" style="display:none">✓</span>
          </div>
        `).join('')}
      </div>
    `;
  } else if (task.type === 'classification') {
    content = `
      <div class="mb-4 p-3 bg-purple-50 rounded-lg"><p class="text-sm text-purple-800">${task.content.instruction}</p></div>
      <div class="space-y-3" id="classificationItems">
        ${task.content.items.map((item, i) => `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-3">
            <span class="font-medium flex-1 text-sm">${item.name}</span>
            <select class="category-select" data-index="${i}" onchange="updateClassification(${i}, this.value)">
              <option value="">Choisir...</option>
              ${task.content.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
            </select>
          </div>
        `).join('')}
      </div>
    `;
  } else if (task.type === 'transcription') {
    content = `
      <div class="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <p class="text-sm text-gray-500 mb-2">📄 Texte à recopier :</p>
        <p class="text-gray-800 italic leading-relaxed">"${task.content.textToTranscribe}"</p>
      </div>
      <textarea id="transcriptionText" class="input h-32" placeholder="Recopiez le texte exactement..."></textarea>
      <p class="text-xs text-gray-500">Précision minimum : ${task.content.minAccuracy}%</p>
    `;
  }

  return `
    <div class="modal" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="flex justify-between items-start mb-4">
          <div>
            <span class="text-xs px-2 py-1 rounded-full ${getTaskTypeColor(task.type)}">${getTaskTypeLabel(task.type)}</span>
            <h2 class="text-lg font-bold mt-2">${task.title}</h2>
            <p class="text-sm text-gray-500">${task.description}</p>
          </div>
          <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div class="mb-6 max-h-80 overflow-y-auto">${content}</div>
        <div class="flex gap-3 sticky bottom-0 bg-white pt-3 border-t">
          <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold">Annuler</button>
          <button onclick="submitTask('${taskId}')" class="flex-1 btn-success py-3">Valider (+${task.reward} FCFA)</button>
        </div>
      </div>
    </div>
  `;
}

function selectOption(questionIndex, optionIndex, value) {
  $$(`[data-question="${questionIndex}"]`).forEach(btn => btn.classList.remove('selected'));
  const btn = $(`[data-question="${questionIndex}"][data-option="${optionIndex}"]`);
  if (btn) btn.classList.add('selected');
  state.surveyAnswers[questionIndex] = value;
  const countEl = $('#answeredCount');
  if (countEl) countEl.textContent = Object.keys(state.surveyAnswers).length;
}

function toggleCheck(element, index) {
  element.classList.toggle('selected');
  const checkmark = element.querySelector('.checkmark');
  checkmark.style.display = element.classList.contains('selected') ? 'block' : 'none';
}

function updateClassification(index, value) {
  state.surveyAnswers[index] = value;
}

async function submitTask(taskId) {
  const task = state.currentTask;
  if (!task) return;

  let answers;

  if (task.type === 'sondage') {
    answers = state.surveyAnswers;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < task.content.questions.length) {
      toast(`Répondez à toutes les questions (${answeredCount}/${task.content.questions.length})`, 'error');
      return;
    }
  } else if (task.type === 'verification') {
    answers = [];
    $$('.check-item.selected').forEach(item => answers.push(parseInt(item.dataset.index)));
    if (answers.length === 0) { toast('Sélectionnez au moins un élément', 'error'); return; }
  } else if (task.type === 'classification') {
    answers = {};
    let allFilled = true;
    $$('.category-select').forEach(sel => {
      if (!sel.value) allFilled = false;
      answers[sel.dataset.index] = sel.value;
    });
    if (!allFilled) { toast('Classifiez tous les éléments', 'error'); return; }
  } else if (task.type === 'transcription') {
    answers = $('#transcriptionText').value;
    if (!answers || answers.trim().length < 10) { toast('Saisissez la transcription complète', 'error'); return; }
  }

  const res = await api(`/api/tasks/${taskId}/complete`, 'POST', { userId: getId(state.currentUser), answers });

  if (res.error) {
    toast(res.error, 'error');
  } else {
    toast(res.message, 'success');
    closeModal();
    state.currentUser = await api(`/api/user/${getId(state.currentUser)}`);
    navigate('tasks');
  }
}

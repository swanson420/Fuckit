```javascript
/**
 * ==========================================================================
 * UNIFIED CORE ARCHITECTURE & UX SPECIFICATION - MAIN.JS
 * Field: Accessibility Advocate | Lens: Semantic Hierarchy
 * ==========================================================================
 */

// --- 2.1 Declarative State Contracts & Mock Data ---
const environmentalNodes = [
  {
    id: 'living-room',
    type: 'shared_space',
    label: 'Living Room Hub',
    requiredAuthRole: 'PUBLIC',
    gogglesSystemPayload: 'SYSTEM_MODE: AMBIENT_CREATIVE\nOPTIMIZE: INTERACTION_FLOW',
    isLocked: false
  },
  {
    id: 'lab-vault',
    type: 'room',
    label: 'Dimension Portal Vault',
    requiredAuthRole: 'RICK_SANCHEZ',
    gogglesSystemPayload: 'SYSTEM_MODE: CRITICAL_WARN\nOPTIMIZE: LATENCY_SAFETY',
    isLocked: true
  },
  {
    id: 'jukebox-lounge',
    type: 'shared_space',
    label: 'Microverse Jukebox Lounge',
    requiredAuthRole: 'PUBLIC',
    gogglesSystemPayload: 'SYSTEM_MODE: AUDIO_SYNC\nOPTIMIZE: EVENT_THROTTLE',
    isLocked: false
  }
];

const currentUser = {
  name: "Rick Sanchez",
  role: "PUBLIC" // Dynamic state assignment for intercept testing
};

// Global App State Container
const AppState = {
  activeNode: environmentalNodes[0],
  mobileView: 'CANVAS',
  isProcessing: false,
  metrics: {
    ttft: 42,
    tps: 85,
    tokens: 1420,
    provider: 'GEMINI_PRO_60'
  }
};

// --- 8.1 Non-Blocking Distributed Ambient Notification Message Broker ---
class AmbientNotificationBroker {
  constructor() {
    this.subscribers = [];
    this.notificationQueue = [];
  }

  publish(payload) {
    const item = { id: crypto.randomUUID(), content: payload, duration: 6000 };
    this.notificationQueue.push(item);
    this.subscribers.forEach(callback => callback(item));
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => { this.subscribers = this.subscribers.filter(cb => cb !== callback); };
  }
}

const ambientBroker = new AmbientNotificationBroker();

// --- 3.0 Cat Finite State Machine (FSM) Ambient Simulation ---
const stateTransitionsMatrix = {
  SLEEPING: { ENVIRONMENTAL_TICK: 'WANDERING', USER_PROMPT_SUBMISSION: 'INTERACTING' },
  WANDERING: { ROOM_CHANGE_DETECTION: 'HUNTING' },
  HUNTING: { TARGET_ACQUISITION_SUCCESS: 'INTERACTING' },
  INTERACTING: { INACTIVITY_TIMEOUT: 'SLEEPING' }
};

const catStateMachine = {
  currentState: 'SLEEPING',
  transition(event, payload = null) {
    const nextState = stateTransitionsMatrix[this.currentState]?.[event];
    if (nextState) {
      this.currentState = nextState;
      this.executeEntryActions(nextState, payload);
    }
  },
  executeEntryActions(state, payload) {
    if (state === 'INTERACTING') {
      ambientBroker.publish("🐾 The Cat entity has awakened and bound to the memory channel!");
    } else if (state === 'WANDERING') {
      ambientBroker.publish("🐾 The Cat entity is wandering into an adjacent electronic node.");
    }
  }
};

// --- Initialization & Core Semantics Bootstrapping ---
document.addEventListener('DOMContentLoaded', () => {
  const nodeContainer = document.getElementById('node-navigation-list');
  const appShell = document.getElementById('app-shell');
  const messageStream = document.getElementById('stream-buffer');
  const promptForm = document.getElementById('prompt-submission-form');
  const textInput = document.getElementById('user-prompt-input');
  const submitBtn = document.getElementById('submit-prompt-btn');

  // Set initial viewport structure
  appShell.setAttribute('data-mobile-view', AppState.mobileView);

  // Render Accessible Tree Navigation Architecture
  function renderNavigation() {
    nodeContainer.innerHTML = '';
    environmentalNodes.forEach(node => {
      const li = document.createElement('li');
      li.setAttribute('role', 'treeitem');
      li.setAttribute('aria-selected', AppState.activeNode.id === node.id ? 'true' : 'false');
      
      const button = document.createElement('button');
      button.className = `nav-node-link ${node.isLocked ? 'node-locked' : ''}`;
      button.innerHTML = `${node.label} ${node.isLocked ? '🔒' : ''}`;
      button.setAttribute('aria-label', `${node.label}, ${node.type === 'shared_space' ? 'Shared Space Asset' : 'Private Room'}`);
      
      // Accessibility: Safe execution on click
      button.addEventListener('click', () => handleNodeTransition(node));
      
      li.appendChild(button);
      nodeContainer.appendChild(li);
    });
    
    document.getElementById('active-node-title').textContent = AppState.activeNode.label;
    document.getElementById('compiled-prompt-display').textContent = AppState.activeNode.gogglesSystemPayload;
  }

  // --- 2.2 Contextual Route Interception Guard Middleware ---
  function handleNodeTransition(targetNode) {
    if (targetNode.isLocked || (targetNode.requiredAuthRole !== 'PUBLIC' && currentUser.role !== targetNode.requiredAuthRole)) {
      ambientBroker.publish(`⚠️ SECURITY_VIOLATION: Access to [${targetNode.label}] denied. Insufficient role permissions.`);
      return;
    }
    
    AppState.activeNode = targetNode;
    renderNavigation();
    catStateMachine.transition('ROOM_CHANGE_DETECTION');
  }

  // --- 6.1 Telemetry Walkthrough Input Pipeline ---
  promptForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const promptValue = textInput.value.trim();
    if (!promptValue || AppState.isProcessing) return;

    // Lock interaction loops to prevent structural race conditions
    AppState.isProcessing = true;
    textInput.setAttribute('disabled', 'true');
    submitBtn.setAttribute('disabled', 'true');

    // Append raw interaction into semantic list layout
    const msgBlock = document.createElement('div');
    msgBlock.className = 'message-block user-query';
    msgBlock.innerHTML = `<strong>User:</strong> ${promptValue}`;
    messageStream.appendChild(msgBlock);
    
    catStateMachine.transition('USER_PROMPT_SUBMISSION');

    // Mock API Client Stream Consumption Simulation
    setTimeout(() => {
      const responseBlock = document.createElement('div');
      responseBlock.className = 'message-block system-response';
      responseBlock.innerHTML = `<strong>System Framework:</strong> Contextual stream parsed successfully using active profile parameter targets.`;
      messageStream.appendChild(responseBlock);
      
      // Update Inspector UI Metrics Box cleanly
      updateTelemetryMetrics();

      // Flush buffers and unlock input engine parameters
      AppState.isProcessing = false;
      textInput.removeAttribute('disabled');
      submitBtn.removeAttribute('disabled');
      textInput.value = '';
      textInput.focus();
    }, 1200);
  });

  // --- 8.2 UX Presentation & Automatic Memory Disposal Loops ---
  const toastBus = document.getElementById('ambient-toast-bus');
  ambientBroker.subscribe((toastItem) => {
    const toast = document.createElement('div');
    toast.className = 'ambient-toast';
    toast.setAttribute('role', 'alert');
    toast.textContent = toastItem.content;
    
    toastBus.appendChild(toast);

    // Strict Memory Garbage Collection Cleanup Cycle
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'opacity 300ms, transform 300ms';
      setTimeout(() => toast.remove(), 300);
    }, toastItem.duration);
  });

  // --- 5.1 Mobile Orchestrator Navigation Elements ---
  document.getElementById('mobile-menu-trigger').addEventListener('click', () => {
    AppState.mobileView = AppState.mobileView === 'MAP' ? 'CANVAS' : 'MAP';
    appShell.setAttribute('data-mobile-view', AppState.mobileView);
  });

  document.getElementById('mobile-inspector-trigger').addEventListener('click', () => {
    AppState.mobileView = AppState.mobileView === 'INSPECTOR' ? 'CANVAS' : 'INSPECTOR';
    appShell.setAttribute('data-mobile-view', AppState.mobileView);
  });

  function updateTelemetryMetrics() {
    document.getElementById('metric-ttft').textContent = `${AppState.metrics.ttft} ms`;
    document.getElementById('metric-tps').textContent = `${AppState.metrics.tps} t/s`;
    document.getElementById('metric-total-tokens').textContent = AppState.metrics.tokens;
    document.getElementById('metric-provider').textContent = AppState.metrics.provider;
  }

  // Initial Runtime Mount Sequence
  renderNavigation();
  updateTelemetryMetrics();
  ambientBroker.publish("🚀 Unified Core Architecture client-side space loaded smoothly.");
});

```

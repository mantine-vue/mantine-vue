<script setup lang="ts">
import { h, ref } from 'vue'
import {
  AngleSlider,
  Autocomplete,
  Checkbox,
  CheckboxGroup,
  Chip,
  ChipGroup,
  ColorInput,
  ColorPicker,
  Fieldset,
  FileInput,
  Group,
  Input,
  InputBase,
  JsonInput,
  MaskInput,
  MultiSelect,
  NativeSelect,
  NumberInput,
  PasswordInput,
  Pill,
  PillsInput,
  PinInput,
  Radio,
  RangeSlider,
  Rating,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  TreeSelect,
} from '@mantine-vue/core'
import { PhAt, PhCalendar, PhLock, PhMagnifyingGlass } from '@phosphor-icons/vue'
import DemoCard from '../components/DemoCard.vue'

const frameworks = ['Vue', 'React', 'Angular', 'Svelte', 'Solid']
const jsonSample = '{\n  "name": "Mantine Vue",\n  "stars": 28000\n}'

const terms = ref(true)
const permissions = ref<string[]>(['read', 'write'])
const shipping = ref('standard')
const size = ref<string[]>(['sm'])
const nativeFramework = ref('Vue')
const library = ref<string | null>('Vue')
const stack = ref<string[]>(['Vue', 'TypeScript'])
const search = ref('')
const tags = ref(['design', 'systems'])
const color = ref('#4c6ef5')
const swatch = ref('rgba(76, 110, 245, 1)')
const resume = ref<File | null>(null)
const angle = ref(135)
const treeValue = ref<string | null>(null)

const treeData = [
  {
    value: 'frontend',
    label: 'Frontend',
    children: [
      { value: 'vue', label: 'Vue' },
      { value: 'react', label: 'React' },
    ],
  },
  {
    value: 'backend',
    label: 'Backend',
    children: [
      { value: 'node', label: 'Node.js' },
      { value: 'go', label: 'Go' },
    ],
  },
]
</script>

<template>
  <Stack gap="lg">
    <DemoCard name="TextInput" description="Base text field with label, description and sections.">
      <Stack gap="sm" style="max-width: 340px">
        <TextInput
          label="Email"
          placeholder="you@example.com"
          description="We'll never share your email."
          :left-section="h(PhAt, { size: 16 })"
          withAsterisk
        />
        <TextInput label="Disabled" placeholder="Can't edit this" disabled />
        <TextInput label="With error" placeholder="Username" error="This username is taken" />
      </Stack>
    </DemoCard>

    <DemoCard name="Textarea" description="Multi-line text input with autosize support.">
      <Textarea
        label="Short bio"
        placeholder="Tell us about yourself"
        autosize
        :minRows="2"
        :maxRows="4"
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard name="PasswordInput" description="Text input that toggles value visibility.">
      <PasswordInput
        label="Password"
        placeholder="Your password"
        :left-section="h(PhLock, { size: 16 })"
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard
      name="NumberInput"
      description="Numeric input with formatting and increment controls."
    >
      <NumberInput
        :defaultValue="1200"
        label="Budget"
        placeholder="Enter amount"
        prefix="$"
        thousandSeparator=","
        :min="0"
        :step="100"
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard name="JsonInput" description="Textarea with JSON validation and formatting.">
      <JsonInput
        :defaultValue="jsonSample"
        label="Configuration"
        validationError="Invalid JSON"
        formatOnBlur
        autosize
        :minRows="4"
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard name="MaskInput" description="Text input constrained to a fixed pattern.">
      <MaskInput
        label="Phone number"
        mask="+1 (000) 000-0000"
        placeholder="+1 (___) ___-____"
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard
      name="Input / Input.Wrapper"
      description="Unstyled base input and its labelled wrapper."
    >
      <Stack gap="sm" style="max-width: 340px">
        <Input
          placeholder="Base Input, no wrapper"
          :left-section="h(PhMagnifyingGlass, { size: 16 })"
        />
        <Input.Wrapper label="Wrapped input" description="Input.Wrapper adds label and description">
          <Input placeholder="Your value" />
        </Input.Wrapper>
      </Stack>
    </DemoCard>

    <DemoCard name="InputBase" description="Base component for building custom inputs.">
      <InputBase
        label="Custom control"
        component="button"
        type="button"
        pointer
        style="max-width: 340px"
      >
        Click to choose a value
      </InputBase>
    </DemoCard>

    <DemoCard name="Checkbox" description="Boolean control, individually or grouped.">
      <Stack gap="md">
        <Checkbox
          :checked="terms"
          label="I accept the terms and conditions"
          @change="terms = ($event.target as HTMLInputElement).checked"
        />
        <CheckboxGroup
          :value="permissions"
          label="Permissions"
          description="Select all that apply"
          @change="permissions = $event"
        >
          <Group mt="xs">
            <Checkbox value="read" label="Read" />
            <Checkbox value="write" label="Write" />
            <Checkbox value="admin" label="Admin" />
          </Group>
        </CheckboxGroup>
      </Stack>
    </DemoCard>

    <DemoCard name="Radio" description="Single choice from a set of options.">
      <Radio.Group
        :value="shipping"
        label="Shipping method"
        withAsterisk
        @change="shipping = $event"
      >
        <Stack gap="xs" mt="xs">
          <Radio value="standard" label="Standard — 5 business days" />
          <Radio value="express" label="Express — 2 business days" />
          <Radio value="overnight" label="Overnight" />
        </Stack>
      </Radio.Group>
    </DemoCard>

    <DemoCard name="Switch" description="On/off toggle with optional labels.">
      <Stack gap="sm">
        <Switch label="Enable notifications" defaultChecked />
        <Switch label="Dark mode" color="grape" onLabel="ON" offLabel="OFF" size="lg" />
      </Stack>
    </DemoCard>

    <DemoCard name="Chip" description="Compact selectable pill, single or multi-select group.">
      <ChipGroup :value="size" multiple @change="size = $event">
        <Group>
          <Chip value="sm">Small</Chip>
          <Chip value="md">Medium</Chip>
          <Chip value="lg">Large</Chip>
        </Group>
      </ChipGroup>
    </DemoCard>

    <DemoCard name="NativeSelect" description="Native HTML select element, Mantine-styled.">
      <NativeSelect
        :value="nativeFramework"
        label="Framework"
        :data="frameworks"
        style="max-width: 340px"
        @change="nativeFramework = ($event.target as HTMLSelectElement).value"
      />
    </DemoCard>

    <DemoCard name="Select" description="Searchable, clearable dropdown select.">
      <Select
        v-model="library"
        label="Favorite library"
        placeholder="Pick one"
        :data="frameworks"
        searchable
        clearable
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard name="MultiSelect" description="Select multiple values as removable pills.">
      <MultiSelect
        v-model="stack"
        label="Your stack"
        placeholder="Pick technologies"
        :data="['Vue', 'React', 'TypeScript', 'Node.js', 'Go', 'Rust']"
        searchable
        clearable
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard name="Autocomplete" description="Text input with autocomplete suggestions.">
      <Autocomplete
        v-model="search"
        label="Search framework"
        placeholder="Start typing…"
        :left-section="h(PhMagnifyingGlass, { size: 16 })"
        :data="frameworks"
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard name="TagsInput" description="Free-form input that captures values as tags.">
      <TagsInput
        v-model="tags"
        label="Keywords"
        placeholder="Press Enter to add"
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard name="PillsInput & Pill" description="Container for pills plus the standalone Pill.">
      <Stack gap="sm" style="max-width: 340px">
        <PillsInput label="Recipients">
          <Pill.Group>
            <Pill withRemoveButton>alice@acme.io</Pill>
            <Pill withRemoveButton>bob@acme.io</Pill>
            <PillsInput.Field placeholder="Add recipient" />
          </Pill.Group>
        </PillsInput>
        <Group>
          <Pill>Read only pill</Pill>
          <Pill withRemoveButton>Removable</Pill>
        </Group>
      </Stack>
    </DemoCard>

    <DemoCard name="ColorInput" description="Text input with a color picker dropdown.">
      <ColorInput
        v-model="color"
        label="Brand color"
        placeholder="Pick a color"
        style="max-width: 340px"
      />
    </DemoCard>

    <DemoCard name="ColorPicker" description="Inline saturation / hue / alpha picker.">
      <Stack gap="xs">
        <ColorPicker :value="swatch" format="rgba" @change="swatch = $event" />
        <Text size="sm" c="dimmed">Value: {{ swatch }}</Text>
      </Stack>
    </DemoCard>

    <DemoCard name="FileInput" description="Button-styled input for selecting files.">
      <FileInput
        :value="resume"
        label="Upload resume"
        placeholder="Choose file"
        :left-section="h(PhCalendar, { size: 16 })"
        clearable
        style="max-width: 340px"
        @change="resume = $event"
      />
    </DemoCard>

    <DemoCard name="Slider" description="Draggable value selector with marks.">
      <Slider
        :defaultValue="60"
        :marks="[
          { value: 0, label: '0%' },
          { value: 50, label: '50%' },
          { value: 100, label: '100%' },
        ]"
        mb="lg"
      />
    </DemoCard>

    <DemoCard name="RangeSlider" description="Select a range between two thumbs.">
      <RangeSlider
        :defaultValue="[200, 800]"
        :min="0"
        :max="1000"
        :step="50"
        :marks="[
          { value: 0, label: '$0' },
          { value: 500, label: '$500' },
          { value: 1000, label: '$1k' },
        ]"
        mb="lg"
      />
    </DemoCard>

    <DemoCard name="AngleSlider" description="Circular control for selecting an angle.">
      <Group align="center" gap="lg">
        <AngleSlider :value="angle" :size="80" :thumbSize="8" @change="angle = $event" />
        <Text size="sm" c="dimmed">{{ angle }}°</Text>
      </Group>
    </DemoCard>

    <DemoCard name="Rating" description="Star rating input with fractions support.">
      <Rating :defaultValue="4" :fractions="2" />
    </DemoCard>

    <DemoCard name="PinInput" description="Segmented input for codes and OTPs.">
      <PinInput :length="4" type="number" oneTimeCode />
    </DemoCard>

    <DemoCard name="SegmentedControl" description="Horizontal single-choice control.">
      <SegmentedControl :data="['Preview', 'HTML', 'Vue']" defaultValue="Preview" />
    </DemoCard>

    <DemoCard name="Fieldset" description="Groups related fields under a legend.">
      <Fieldset legend="Account details" style="max-width: 340px">
        <TextInput label="Full name" placeholder="Ada Lovelace" />
        <TextInput label="Company" placeholder="Acme Inc." mt="sm" />
      </Fieldset>
    </DemoCard>

    <DemoCard name="TreeSelect" description="Select a value from a hierarchical tree.">
      <TreeSelect
        v-model="treeValue"
        label="Team"
        placeholder="Pick a team"
        :data="treeData"
        clearable
        style="max-width: 340px"
      />
    </DemoCard>
  </Stack>
</template>

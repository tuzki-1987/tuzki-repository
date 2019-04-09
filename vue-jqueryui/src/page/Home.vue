<template>
	<div>
		<Head titleTxt='vue 使用 jQueryUI 的 Draggable/Droppable/Sortable'></Head>
		<Dragdropsort></Dragdropsort>
	</div>
</template>

<script>
import Head from '../components/Head.vue'
import Dragdropsort from '../components/Dragdropsort.vue'
export default {
	name: 'Home',
	components: {
		Head,
		Dragdropsort
	}
}
</script>

<style scoped></style>

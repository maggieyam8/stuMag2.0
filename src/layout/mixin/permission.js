import { mapGetters } from 'vuex/dist/vuex.common.js';


export default {
    computed: {
        ...mapGetters('permission', ['hasButtonPermission']),

       
        
    },


    methods: {
        //权限验证
        hasPermi(permission) {
            const permissions = this.$store.state.permission.buttonPermissions.lesson || []
            return permissions.includes(permission);
      
          },
    }
}
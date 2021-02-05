var eventBus = new Vue({})

Vue.component('product-details', {
    props:{
        details:{
            type: Array,
            required:true
        }    
    },
    template:`<ul>
    <li v-for="detail in details">{{ detail }}</li>
    </ul>`,
})

Vue.component('product', {
    props:{
        premium:{
            type: Boolean,
            required: true
        },
        alternative:{
            type: Boolean,
            required: true
        }
    },
    template:`
    <div class="product">
    <div class="product-image">
        <img :src="image" alt="">
    </div>
    <div class="product-info">
        <h1>{{ title }}</h1>
        <a :href="link" target="_blank"> Link to my Email</a>
        <p v-if="inStock">In stock</p>
        <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
        <p> User is premium: {{premium}}</P>
        <p> Shipping: {{shipping}}</p>
        <a :href="shoe">{{altern}} </a>

        <info-tabs :shipping="shipping" :details="details"></info-tabs>

        <product-details :details="details"></product-details>
        <div v-for="(variant, index) in variants" 
            :key="variant.variantId"
            class="color-box"
            :style="{backgroundColor:variant.variantColor }"
            @mouseover="updateProduct(index)">
        </div>
        
        <ul>
            <li v-for= "size in sizes" :key="size">{{size}}</li>
        </ul>
        
        <button v-on:click="addToCart" 
            :disabled="!inStock"
            :class="{disabledButton: !inStock}">Add to Cart</button>
        <button @click="removeFromCart">Remove cart</button>

        <product-tabs :reviews="reviews"></product-tabs>
        
        <p v-if="onSale">{{kind}} are on Sale</p>
        <p v-else>{{kind}} are not on Sale</p>

        
       
        <!-- <p v-show="inStock">In Stock</p> -->
        <!-- <p v-show="oStock">Out of Stock</p> -->
        <!-- <span v-if="onSale">On Sale</span> -->
        <!-- <p v-if="inventory > 10">In Stock</p>
        <p v-else-if="inventory <= 10 && inventory > 0"> Almost out of Stock</p>
        <p v-else>Out of Stock</p> -->
        <!-- <span :title="message">
            This life just dey
        </span> -->
    </div>
</div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'socks',
            link: 'https://mail.google.com/mail/u/0/#inbox',
            shoe:'',
            selectedVariant: 0,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId:2234,
                    variantColor:"green",
                    variantImage:'./images/vmSocks-green-onWhite.jpg',
                    variantQuantity:10
                },
                {
                    variantId:2235,
                    variantColor:"blue",
                    variantImage:'./images/vmSocks-blue.png',
                    variantQuantity:0
                }
            ],
            sizes:["S","M","L","XL","XXL","XXXL"],
            
            onSale: true,

            reviews: []

            // oStock: true,
            // onSale: true
            // message: 'I\'m a bad boy'
            // inventory: 55
        }
        
    },
    methods: {
        addToCart(){
            this.$emit('add-to-cart',this.variants[this.selectedVariant].variantColor)
        },

        updateProduct(index){
            this.selectedVariant = index
        },
        

        removeFromCart(){
            // this.cart -=1
            this.$emit('remove-cart',this.variants[this.selectedVariant].variantColor)
        },

        
    },

    computed:{
        title(){
          return  `${this.brand} ${this.product}`
        },

        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        kind(){
            return `${this.brand} ${this.product}`
        },
        shipping(){
            if(this.premium){
                return `Shippping is free`
            }else{
                return `2.99`
            }
        },
        altern(){
            if(this.alternative){
                return `another banger link`
            }else{
                return`road no dey`
            }
        }
    },
    mounted() {
        eventBus.$on('review-subitted',productReview=>{this.reviews.push(productReview)})
    },

})

Vue.component("product-review", {
    template:`
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>
    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

    <p> Would you recommend this product ? </p>
        <label>
        Yes
        <input type="radio" value="Yes"  v-model="reccomend">
        </label>
        <label>
        No
        <input type="radio" value="No"  v-model="reccomend">
        </label>
    
        
    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            reccomend:null,
            errors:[]
        }
    },
    methods: {
        onSubmit(){
            if(this.name && this.review && this.rating && this.reccomend){
                let productReview= {
                    name: this.name,
                    review:this.review,
                    rating:this.rating,
                    reccomend:this.reccomend
                }
                eventBus.$emit('review-submitted',productReview)
                this.name=null,
                this.review=null,
                this.rating=null,
                this.reccomend=null
            } else {
                if(!this.name) this.errors.push("Name required !")
                if(!this.review) this.errors.push("Review required !")
                if(!this.rating) this.errors.push("Rating required !")
                if(!this.reccomend) this.errors.push("Question required !")
            }
            
        }
    },
})

Vue.component('product-tabs', {
    props:{
        reviews:{
            type:Array,
            required:false
        }
    },
    template:`
    <div>
        <span class="tab"
        :class="{ activeTab: selectedTab ===tab}"
        v-for= "(tab, index) in tabs" :key="index" @click="selectedTab=tab">
        {{tab}}
        </span>
    
    <div v-show= "selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul v-else>
            <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating:{{ review.rating }}</p>
                <p>{{ review.review }}</p>
            </li>
    </ul>
    </div>
    
        <product-review v-show= "selectedTab === 'Make a Review'"></product-review>
    </div>`,
    data() {
        return {
            tabs:['Reviews','Make a Review'],
            selectedTab:'Reviews'
        }
    },
})
Vue.component('info-tabs', {
    props: {
      shipping: {
        required: true
      },
      details: {
        type: Array,
        required: true
      }
    },
    template: `
      <div>
      
        <ul>
          <span class="tabs" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>
    
      </div>
    `,
    data() {
      return {
        tabs: ['Shipping', 'Details'],
        selectedTab: 'Shipping'
      }
    }
  })

var app = new Vue({
    el: '#app',
    data() {
        return {
            premium: true,
            alternative: false,
            cart: [], 
        }
    },
    methods: {
        updateCart(id){
            this.cart.push(id)
        },
        removeCart(id){
            this.cart.pop(id)
        }
    },
   
})
